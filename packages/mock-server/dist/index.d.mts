declare const CONFIG: {
    mockFilePath: string;
};
type EndpointDefinition = {
    urlPattern: string;
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
    debugUrl: string;
    mockFnPath: string;
    disabled?: boolean;
    delay?: number;
};
type RecursiveEndpoints<T = any> = Record<string, T | EndpointDefinition>;
type ApiDef = RecursiveEndpoints<RecursiveEndpoints>;
declare const delay: (ms?: number) => Promise<unknown>;

declare function createMockServer(routes: ApiDef): {
    start: (port?: number, ...rest: any[]) => void;
};

export { type ApiDef, CONFIG, type EndpointDefinition, createMockServer, delay };
