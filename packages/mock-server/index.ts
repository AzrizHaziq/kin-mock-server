import { type ApiDef, delay, CONFIG } from './src/common';
import { registerRoutes, app } from './src/server';

function createMockServer(routes: ApiDef) {
  registerRoutes(routes);

  return {
    start: (port: number = parseInt(process.env.PORT ?? '3000', 10), ...rest) => {
      console.log(`Mock server running at http://localhost:${port}`);

      app.listen(port, ...rest, () => {
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