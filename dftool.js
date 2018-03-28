#!/usr/bin/env node

const { dfExport, dfImport } = require('./dialogflow');

require('yargs')
  .usage('$0 <cmd> [args]')
  .command('export <projectId>', 'Export the given Dialogflow project to disk.', (yargs) => {
    yargs.positional('projectId', {
      type: 'string',
      describe: 'the ID of the GCP project'
    });
  }, argv => {
    dfExport(argv.projectId);
  })
  .command('import <projectId> <webhookUrl>', 'Import from disk to the given Dialogflow project.', (yargs) => {
    yargs.positional('projectId', {
      type: 'string',
      describe: 'the ID of the GCP project'
    }),
    yargs.positional('webhookUrl', {
      type: 'string',
      describe: 'the fulfillment webhook.url you want to use for this project'
    });
  }, argv => {
    dfImport(argv.projectId, argv.webhookUrl);
  })
  .demandCommand(1, '')
  .help()
  .argv;
