import { ApiDef } from './src/common';
import { registerRoutes } from './src/server';

export function createMockServer(routes: ApiDef) {
  registerRoutes(routes);

  return {
    start: (port: number = 3000) => {
      console.log(`Mock server running at http://localhost:${port}`);
    }
  };
}

export type { ApiDef, EndpointDefinition } from './src/common';