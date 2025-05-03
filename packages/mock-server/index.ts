import { type ApiDef, delay, CONFIG } from './src/common';
import { registerRoutes, app } from './src/server';

function createMockServer(routes: ApiDef) {
  registerRoutes(routes);

  return {
    start: ({
      port = parseInt(process.env.PORT ?? (CONFIG.PORT + ''), 10),
      host = '127.0.0.1'
    }) => {
      console.log(`Mock server running at http://${host}:${port}`);

      app.listen(port, host, () => {
        console.log("Server running at PORT: ", port);
      }).on("error", (error) => {
        // gracefully handle error
        throw new Error(error.message);
      });
    }
  };
}

export type { ApiDef, EndpointDefinition } from './src/common';
export { delay, CONFIG, createMockServer };