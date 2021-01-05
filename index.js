#!/usr/bin/env node
const yargs = require('yargs');
const { saveFile, makeRequest, fileNameCheck } = require('./cmd-app-axios');
const { stringifyObject } = require('./utils');
// const cmdApp = require('./cmd-app-request');

(async () => {
  try {
    const options = yargs
      .option('u', {
        alias: 'uri',
        describe: 'API URL to be called',
        type: 'string',
        demandOption: true,
      })
      .option('m', {
        alias: 'method',
        describe: 'method type',
        type: 'string',
        demandOption: true,
      })
      .option('b', {
        alias: 'body',
        describe: 'body',
        type: 'string',
        demandOption: false,
      })
      .option('c', {
        alias: 'contentType',
        describe: 'content type',
        type: 'string',
        demandOption: false,
      })
      .option('f', {
        alias: 'file-name',
        describe: 'file name of where the result will be saved',
        type: 'string',
        demandOption: false,
      })
      .option('t', {
        alias: 'times',
        describe: 'times of api will be called',
        type: 'number',
        default: 1,
        demandOption: false,
      }).argv;

    let fileName = await fileNameCheck(options['file-name']);
    for (let i = 0; i < options['times']; i++) {
      let result = stringifyObject(
        await makeRequest(
          options.uri,
          options.method,
          options.body,
          options.contentType
        )
      );
      await saveFile(result, fileName);
    }
  } catch (error) {
    console.error('Error in the application: ' + error.message);
  }
})();
