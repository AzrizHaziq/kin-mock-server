#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'node:fs';
import path from 'node:path';

const command = process.argv[2];

if (!command || command === '--help' || command === '-h') {
  console.log(`
Usage: kinesso-mock-server-cli <command>

Commands:
  init [folder-name]    Initialize a new mock server project
  help                  Show this help message

Examples:
  kinesso-mock-server-cli init
  kinesso-mock-server-cli init my-mock-server
  `);
  process.exit(0);
}

async function main() {
  if (command === 'init') {
    const folderName = process.argv[3] || '.';
    await initializeProject(folderName);
  } else {
    console.error(`Unknown command: ${command}`);
    console.log('Run kinesso-mock-server-cli --help for usage information');
    process.exit(1);
  }
}

async function initializeProject(folderName: string) {
  const { _folderName } = await inquirer.prompt([
    {
      type: 'input',
      name: '_folderName',
      message: 'Enter folder name for mock server configuration:',
      default: folderName
    }
  ]);

  const finalFolderName = slugify(_folderName);
  const folderPath = path.join(process.cwd(), finalFolderName);
  const folderPathMockFn = path.join(folderPath, 'mock-fn');

  if (fs.existsSync(folderPath)) {
    console.error(`Folder ${finalFolderName} already exists.`);
    return;
  }

  fs.mkdirSync(folderPath, { recursive: true });
  fs.mkdirSync(folderPathMockFn, { recursive: true });

  // Read mock-server version
  const mockServerPackageJson = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../../mock-server/package.json'),
      'utf-8'
    )
  );

  const packageJson = {
    name: finalFolderName,
    version: "1.0.0",
    description: "Mock server project",
    main: "routes.ts",
    scripts: {
      "start": `tsx watch routes.ts`
    },
    dependencies: {
      "kinesso-mock-server": `^${mockServerPackageJson.version}`
    },
    devDependencies: {
      "tsx": "^4.19.0",
      "typescript": "^5.5.4"
    }
  };

  fs.writeFileSync(
    path.join(folderPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

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

export const mockServer = createMockServer(routes, __dirname).start({ port: 3000 });`;

  fs.writeFileSync(`${folderPath}/routes.ts`, routesContent);

  ////////////////////////////////////////////////
  const mockContent = `import { MockFn } from 'kinesso-mock-server';

export const mockFn: MockFn<any, { data: { message: string }}> = () => ({
  data: {
    message: 'Hello from mock server!'
  }
});
`;

  fs.writeFileSync(`${folderPathMockFn}/example.mock.ts`, mockContent);

  console.log('Successfully initialized mock server configuration!');
  console.log(`
Next steps:
1. cd ${finalFolderName}
2. npm install
3. npm run mock:start
  `);
}

main();

function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
  return str
}