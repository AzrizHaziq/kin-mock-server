import express, {Request, Response, NextFunction} from "express";
import bodyParser from 'body-parser'
import {ApiDef, CONFIG, EndpointDefinition, generateHtml, MockFn} from "mocks/common";
import cors from "cors"
import {endpoints} from "routes";

const PORT: number = parseInt(process.env.PORT ?? '3000', 10);

const app = express();
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({extended: false})) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

const corsConfig = {origin: true, credentials: true}
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

// extend the Request interface to add a mockProfile property
declare global {
  namespace Express {
    interface Request {
      mockProfile: any;
    }
  }
}
app.use((req: Request, res: Response, next: NextFunction) => {
  req.mockProfile = req.headers['mock-profile'] || 'development';
  next();
});

// this is for http://localhost:3000
app.get("/", (_: Request, response: Response) => {
  const html = generateHtml(endpoints);

  response.status(200).send(`
    <h1>Mock Server Documentation</h1>
    <p>This is the mock server. Please help create any missing routes.</p>
    ${html}
    <div style="display: flex; gap: 2px; align-items: center">
      <p>More info here:</p>
      <a href="https://kinesso.atlassian.net/browse/BGENIUS-14357">BGENIUS-14357</a>
      <a href="https://kinesso.atlassian.net/browse/BGENIUS-14791">BGENIUS-14791</a>
    </div>
  `);
});

// this is the magic
;(function registerRoutes(apiDef: typeof endpoints): void {
  Object.entries(apiDef).forEach(([_, value]: [key: string, value: ApiDef | EndpointDefinition]) => {
    if ('urlPattern' in value) {
      const endpoint = value as EndpointDefinition;

      app[endpoint.method ?? 'get'](endpoint.urlPattern, async (req: Request, res: Response) => {

        if (endpoint?.active != undefined && !endpoint?.active) {
          res.status(404).json({ error: 'Mock is disabled', errorCode: 'MOCK_IS_DISABLED' });
          return;
        }
        res.setHeader(CONFIG.mockFilePath, endpoint.mockFnPath);

        try {
          const tsFile = await import(endpoint.mockFnPath) as { mockFn: MockFn<{}, {}> }
          const result = await tsFile?.mockFn?.(req, res) ?? Error(`MockPathError: ${endpoint.mockFnPath}: Mock should export const mockFn: MockFn<> = () => {}`);

          if (result instanceof Error) throw result;

          // add a delay to simulate loading placeholder
            const delay = endpoint?.delay ?? 0;
            if (delay > 0) {
              await new Promise(resolve => setTimeout(resolve, delay));
            }

          res.json(result);
        } catch (e) {
          // @ts-ignore
          res.status(500).json({ error: e?.message, errorCode: 'MOCK_SERVER_ERROR' });
        }
      });
    } else {
      registerRoutes(value as ApiDef);
      return;
    }
  })
})(endpoints);

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});