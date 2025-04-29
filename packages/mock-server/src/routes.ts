import { ApiDef } from "./common";

export const endpoints: ApiDef = {
  health: {
    urlPattern: '/api/health',
    mockFnPath: 'mocks/main/health.ts',
    debugUrl: 'http://localhost:3000/api/health',
  },
  client: {
    urlPattern: `hello`,
    mockFnPath: "mocks/main/client.ts",
    debugUrl: 'http://localhost:3000/',
  },
} as const
