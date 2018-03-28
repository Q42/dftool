#!/usr/bin/env node

const { dfExport, dfImport } = require('./dialogflow');

require('yargs')
  .usage('$0 <cmd> [args]')
  .command('export <projectId> <directory>', 'Export the given Dialogflow project to the dir.', (yargs) => {
    yargs.positional('projectId', {
      type: 'string',
      describe: 'the ID of the GCP project'
    });
    yargs.positional('directory', {
      type: 'string',
      describe: 'the local directory where you want the exported files'
    });
  }, argv => {
    dfExport(argv.projectId, argv.directory);
  })
  .command('import <projectId> <directory> <webhookUrl>', 'Import from the dir to the given Dialogflow project.', (yargs) => {
    yargs.positional('projectId', {
      type: 'string',
      describe: 'the ID of the GCP project'
    });
    yargs.positional('directory', {
      type: 'string',
      describe: 'the local directory from where you want to read'
    });
    yargs.positional('webhookUrl', {
      type: 'string',
      describe: 'the fulfillment webhook.url you want to use for this project'
    });
  }, argv => {
    dfImport(argv.projectId, argv.directory, argv.webhookUrl);
  })
  .demandCommand(1, '')
  .help()
  .argv;
