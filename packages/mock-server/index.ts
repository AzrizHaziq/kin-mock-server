import { type ApiDef, delay, CONFIG } from './src/common';
import { registerRoutes, app } from './src/server';
import path from 'node:path';

// basePath should be the directory containing the routes file
function createMockServer(routes: ApiDef, basePath = __dirname) {
  console.log('basePath', basePath);
  // If basePath is not provided, attempt to determine it from the caller.
  // This is experimental and might not work in all environments (e.g., ESM, bundlers).
  // It's safer for the caller to provide __dirname or an equivalent.
  const resolvedBasePath = basePath ?? path.dirname(require.main?.filename || process.cwd());

  return {
    start: ({ port = CONFIG.PORT, host = 'localhost' }: { port?: number, host?: string }) => {
      // Register routes before starting the server, passing the resolved base path
      registerRoutes(routes, resolvedBasePath);

      app.listen(port, host, () => {
        console.log("Server running at PORT: ", port);
      }).on("error", (error) => {
        // gracefully handle error
        throw new Error(error.message);
      });
    }
  };
}

export type { ApiDef, EndpointDefinition, MockFn } from './src/common';
export { delay, CONFIG, createMockServer }; // Export types as well