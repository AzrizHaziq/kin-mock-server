#!/usr/bin/env node
var a=Object.create;var i=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var l=Object.getPrototypeOf,u=Object.prototype.hasOwnProperty;var v=(e,o,r,c)=>{if(o&&typeof o=="object"||typeof o=="function")for(let t of p(o))!u.call(e,t)&&t!==r&&i(e,t,{get:()=>o[t],enumerable:!(c=k(o,t))||c.enumerable});return e};var f=(e,o,r)=>(r=e!=null?a(l(e)):{},v(o||!e||!e.__esModule?i(r,"default",{value:e,enumerable:!0}):r,e));var m=require("commander"),n=f(require("fs")),s=new m.Command;s.name("kinesso-mock-server").description("CLI for kinesso-mock-server initialization").version("1.0.0");s.command("init").description("Initialize a new mock server configuration").action(()=>{let e=`import { createMockServer } from 'kinesso-mock-server';

const routes = {
  // Example route configuration
  example: {
    urlPattern: '/api/example',
    method: 'get',
    mockFnPath: './mocks/example.mock.ts',
    delay: 200,
    active: true
  }
};

export const mockServer = createMockServer(routes);
`,o=`import { MockFn } from 'kinesso-mock-server';

export const mockFn: MockFn = () => ({
  data: {
    message: 'Hello from mock server!'
  }
});
`;n.default.mkdirSync("./mocks",{recursive:!0}),n.default.writeFileSync("./routes.ts",e),n.default.writeFileSync("./mocks/example.mock.ts",o),console.log("Successfully initialized mock server configuration!")});s.parse(process.argv);
