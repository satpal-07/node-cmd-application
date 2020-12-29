const yargs = require('yargs');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

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

    const result = await makeRequest(
      options.uri,
      options.method,
      options.body,
      options.contentType
    );
    console.log(result);
    await aveFile(result, options['file-name']);
  } catch (error) {
    console.error('Error in the application: ' + error.message);
  }
}

function parseToJson(param) {
  try {
    return JSON.parse(param);
  } catch (error) {
    console.log(`Error in parsing param to JSON: ${error.message}`);
  }
  return param;
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
      uri: uri,
      body: body,
      json: true, // Automatically stringifies the body to JSON
      resolveWithFullResponse: true,
      headers: {
        'Content-Type': contentType,
      },
    };
    let result = await request(requestOptions);
    console.log(result.statusCode);
    if (typeof result.body === 'string') {
      result.body = parseToJson(result.body);
    }
    return result.body;
  } catch (error) {
    console.log(`Error in making api call: ${error.message}`);
    throw new Error('Error in calling API');
  }
}

async function saveFile(content, fileName = generateFileName()) {
  try {
    fileName = path.join(__dirname, fileName);
    if (fs.existsSync(fileName)) {
      console.log('File name already exists...');
      let prompt = await prompMessage(
        'File name provided exists. Please provide new file name',
        'fileName'
      );

      fileName = path.join(__dirname, prompt.fileName);
      while (fs.existsSync(fileName)) {
        prompt = await prompMessage(
          'File name provided exists. Please provide new file name',
          'fileName'
        );
        fileName = path.join(__dirname, prompt.fileName);
      }
    }
    fs.writeFileSync(fileName, stringifyObject(content));
  } catch (err) {
    console.error(`Error in saving file: ${err.message}`);
    throw new Error('Error in saving file');
  }
}

function stringifyObject(param) {
  try {
    if (typeof param === 'object') {
      return JSON.stringify(param);
    }
  } catch (error) {
    console.log(`Error in parsing obj to string: ${error.message}`);
  }
  return param;
}

function generateFileName() {
  return new Date().getTime() + '.txt';
}

async function prompMessage(message, name, type = 'input') {
  const response = await inquirer.prompt({
    name,
    type,
    message,
  });
  return response;
}

module.exports = {
  startApp,
  prompMessage,
  stringifyObject,
  saveFile,
  makeRequest,
};
