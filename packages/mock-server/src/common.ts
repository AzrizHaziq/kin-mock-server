import { Request, Response } from "express";
import { kebabCase } from "lodash-es";

export const CONFIG = {
  mockFilePath: 'X--mock-server--filepath' // Custom header to store the mock file path
}

export type EndpointDefinition = {
  urlPattern: string, // express url pattern
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch', // default 'get'
  debugUrl: string, // for debugging mock-server
  mockFnPath: string, // path to the mock function
  disabled?: boolean,
  delay?: number, // delay in ms
}

export type MockFn<T, R> = (xReq: Request & T, xRes: Response) => R | Error | Promise<R | Error> // mocked response

type RecursiveEndpoints<T = any> = Record<string, T | EndpointDefinition>
export type ApiDef = RecursiveEndpoints<RecursiveEndpoints>

export function generateHtml(apiDef: ApiDef, basePath: string = ''): string {
  let html = '<ul>';

  for (const key in apiDef) {
    if ('urlPattern' in apiDef[key]) {
      const endpoint = apiDef[key] as EndpointDefinition;
      html += `
        <li>
          <span style="text-transform: uppercase">${endpoint.method ?? 'get'} </span> 
          <a href="${endpoint.debugUrl}">${kebabCase(key)}</a>
        </li>
      `;
    } else {
      html += `
        <li>
          <strong>${key}: </strong>
          ${generateHtml(apiDef[key] as RecursiveEndpoints, `${basePath}/${key}`)}
        </li>
      `;
    }
  }

  html += '</ul>';
  return html;
}

export const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));