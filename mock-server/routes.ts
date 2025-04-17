import {ApiDef} from "mocks/common";

export const endpoints: ApiDef = {
    health :{
      urlPattern: '/api/health',
      mockFnPath: 'mocks/main/health.ts',
      debugUrl: 'http://localhost:3000/api/health',
    },
    client: {
      urlPattern: `/api/clients/:clientId(\\d+)`,
      mockFnPath: "mocks/main/client.ts",
      debugUrl: 'http://localhost:3000/api/clients/1293/',
    },
    whoami: {
      urlPattern: '/api/whoami',
      mockFnPath: "mocks/main/whoami.ts",
      debugUrl: 'http://localhost:3000/api/whoami',
    },
} as const
