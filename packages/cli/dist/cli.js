#!/usr/bin/env node
var l=Object.create;var a=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var u=Object.getPrototypeOf,k=Object.prototype.hasOwnProperty;var d=(e,o,r,c)=>{if(o&&typeof o=="object"||typeof o=="function")for(let t of f(o))!k.call(e,t)&&t!==r&&a(e,t,{get:()=>o[t],enumerable:!(c=p(o,t))||c.enumerable});return e};var s=(e,o,r)=>(r=e!=null?l(u(e)):{},d(o||!e||!e.__esModule?a(r,"default",{value:e,enumerable:!0}):r,e));var m=s(require("inquirer")),n=s(require("fs")),i=s(require("path"));async function g(){let{_folderName:e}=await m.default.prompt([{type:"input",name:"_folderName",message:"Enter folder name for mock server configuration:",default:"."}]),o=y(e),r=i.default.join(process.cwd(),o),c=i.default.join(r,"mock-fn");if(n.default.existsSync(r)){console.error(`Folder ${o} already exists.`);return}n.default.mkdirSync(r,{recursive:!0}),n.default.mkdirSync(c,{recursive:!0}),n.default.writeFileSync(`${r}/routes.ts`,`import { createMockServer, type ApiDef, type EndpointDefinition } from 'kinesso-mock-server';

const routes: ApiDef = {
  // Example route configuration
  example: {
    urlPattern: '/api/example',
    mockFnPath: './mock-fn/example.mock.ts',
    delay: 200,
    disabled: false
  }
};

export const mockServer = createMockServer(routes);
`),n.default.writeFileSync(`${c}/example.mock.ts`,`import { MockFn } from 'kinesso-mock-server';

export const mockFn: MockFn = () => ({
  data: {
    message: 'Hello from mock server!'
  }
});
`),console.log("Successfully initialized mock server configuration!"),console.log(`Update your package to run mock-server
    "scripts": {
      ...,
      "mock:start": "tsx watch ${r}/routes.ts"
    }
    `)}g();function y(e){return e=e.replace(/^\s+|\s+$/g,""),e=e.toLowerCase(),e=e.replace(/[^a-z0-9 -]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"),e}
