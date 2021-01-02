const yargs = require('yargs');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { stringifyObject, generateFileName, prompMessage } = require('./utils');

async function startApp() {
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
      }).argv;

    let result = await makeRequest(
      options.uri,
      options.method,
      options.body,
      options.contentType
    );
    await saveFile(result, options['file-name']);
  } catch (error) {
    console.error('Error in the application: ' + error.message);
  }
}

async function makeRequest(
  uri,
  method,
  body,
  contentType = 'application/json'
) {
  try {
    let requestOptions = {
      method: method,
      url: uri,
      data: {
        body: body,
      },
      headers: {
        'Content-Type': contentType,
      },
    };
    let result = await axios(requestOptions);
    console.log(result.status);
    return result.data;
  } catch (error) {
    console.log(`Error in making api call: ${error.message}`);
    throw new Error('Error in calling API');
  }
}

async function saveFile(content, fileName = generateFileName()) {
  try {
    fileName = path.join(__dirname, fileName);
    if (await checkFileExists(fileName)) {
      console.log('File name already exists...');
      let prompt = await prompMessage(
        'File name provided exists. Please provide new file name',
        'fileName'
      );

      fileName = path.join(__dirname, prompt.fileName);
      while (await checkFileExists(fileName)) {
        prompt = await prompMessage(
          'File name provided exists. Please provide new file name',
          'fileName'
        );
        fileName = path.join(__dirname, prompt.fileName);
      }
    }
    await fs.writeFile(fileName, stringifyObject(content));
  } catch (err) {
    console.error(`Error in saving file: ${err.message}`);
    throw new Error('Error in saving file');
  }
}

async function checkFileExists(file) {
  return fs
    .access(file)
    .then(() => true)
    .catch(() => false);
}

module.exports = {
  startApp,
  saveFile,
  makeRequest,
};
