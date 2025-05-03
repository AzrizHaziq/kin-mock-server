import express, { Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser'
import { ApiDef, CONFIG, EndpointDefinition, generateHtml, MockFn, delay } from "./common";
import cors from "cors"
import { endpoints } from "src/routes";

const app: ReturnType<typeof express> = express();
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

const corsConfig = { origin: true, credentials: true }
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
export function registerRoutes(apiDef: typeof endpoints): void {
  Object.entries(apiDef).forEach(([_, value]: [key: string, value: ApiDef | EndpointDefinition]) => {
    if ('urlPattern' in value) {
      const endpoint = value as EndpointDefinition;
      if (endpoint?.disabled) return;

      app[endpoint.method ?? 'get'](endpoint.urlPattern, async (req: Request, res: Response) => {
        res.setHeader(CONFIG.mockFilePath, endpoint.mockFnPath);

        if ((endpoint?.delay ?? 0) > 0) {
          await delay(endpoint?.delay)
        }

        try {
          const tsFile = await import(endpoint.mockFnPath) as { mockFn: MockFn<{}, {}> }
          const result = await tsFile?.mockFn?.(req, res) ?? Error(`MockPathError: ${endpoint.mockFnPath}: Mock should export const mockFn: MockFn<> = () => {}`);

          if (result instanceof Error) throw result;

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
};
registerRoutes(endpoints);

export { app }