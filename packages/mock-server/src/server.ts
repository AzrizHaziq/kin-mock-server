import express, { Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser'
import { ApiDef, CONFIG, EndpointDefinition, generateHtml, MockFn, delay } from "./common";
import cors from "cors"
import path from "node:path"

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
export const registerIndexRoute = (endpoints: ApiDef) => {
  app.get("/", (_: Request, response: Response) => {
    const html = generateHtml(endpoints);

    response.status(200).send(`
      <h1>Mock Server Documentation</h1>
      <p>This is the mock server. Please help create any missing routes.</p>
      ${html}
    `);
  });
}

// this is the magic
export function registerRoutes(apiDef: ApiDef, basePath: string): void {
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
          // Resolve the mock function path relative to the basePath provided
          const absoluteMockFnPath = path.resolve(basePath, endpoint.mockFnPath);
          res.setHeader(CONFIG.mockFilePath, absoluteMockFnPath); // Update header with resolved path

          const tsFile = await import(absoluteMockFnPath) as { mockFn: MockFn<{}, {}> }

          const result = await tsFile?.mockFn?.(req, res) ?? Error(`MockPathError: ${endpoint.mockFnPath}: Mock should export const mockFn: MockFn<> = () => {}`);

          if (result instanceof Error) throw result;

          res.json(result);
        } catch (e) {
          // @ts-ignore
          res.status(500).json({ error: e?.message, errorCode: 'MOCK_SERVER_ERROR' });
        }
      });
    } else {
      // Recursively register routes, passing the basePath down
      registerRoutes(value as ApiDef, basePath);
      return;
    }
  })
};
// registerRoutes(endpoints); // Routes should be registered via createMockServer

export { app }