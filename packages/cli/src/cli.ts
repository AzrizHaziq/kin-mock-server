#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const { _folderName } = await inquirer.prompt([
    {
      type: 'input',
      name: '_folderName',
      message: 'Enter folder name for mock server configuration:',
      default: '.'
    }
  ]);

  const folderName = slugify(_folderName);
  const folderPath = path.join(process.cwd(), folderName);
  const folderPathMockFn = path.join(folderPath, 'mock-fn');

  if (fs.existsSync(folderPath)) {
    console.error(`Folder ${folderName} already exists.`);
    return;
  }

  fs.mkdirSync(folderPath, { recursive: true });
  fs.mkdirSync(folderPathMockFn, { recursive: true });

  ////////////////////////////////////////////////
  const routesContent = `import { createMockServer, type ApiDef, type EndpointDefinition } from 'kinesso-mock-server';

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
`;
  fs.writeFileSync(`${folderPath}/routes.ts`, routesContent);

  ////////////////////////////////////////////////
  const mockContent = `import { MockFn } from 'kinesso-mock-server';

export const mockFn: MockFn = () => ({
  data: {
    message: 'Hello from mock server!'
  }
});
`;

  fs.writeFileSync(`${folderPathMockFn}/example.mock.ts`, mockContent);

  console.log('Successfully initialized mock server configuration!');
  console.log(`Update your package to run mock-server
    "scripts": {
      ...,
      "mock:start": "tsx watch ${folderPath}/routes.ts"
    }
    `)
};

main();

function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
  return str
}