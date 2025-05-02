#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'node:fs';
import path from 'node:path';

const program = new Command();

program
  .name('kinesso-mock-server')
  .description('CLI for kinesso-mock-server initialization')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new mock server configuration')
  .action(() => {
    const routesContent = `import { createMockServer } from 'kinesso-mock-server';

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
`;

    const mockContent = `import { MockFn } from 'kinesso-mock-server';

export const mockFn: MockFn = () => ({
  data: {
    message: 'Hello from mock server!'
  }
});
`;

    // Create directories
    fs.mkdirSync('./mocks', { recursive: true });

    // Write files
    fs.writeFileSync('./routes.ts', routesContent);
    fs.writeFileSync('./mocks/example.mock.ts', mockContent);

    console.log('Successfully initialized mock server configuration!');
  });

program.parse(process.argv);