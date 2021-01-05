const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { generateFileName, prompMessage, checkFileExists } = require('./utils');

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
    console.log(`API call returned following status code: ${result.status}`);
    return result.data;
  } catch (error) {
    console.log(`Error in making api call: ${error.message}`);
    throw new Error(`Error in calling API: ${error.message}`);
  }
}

async function fileNameCheck(fileName) {
  if (await checkFileExists(fileName)) {
    let prompt = await prompMessage(
      'File name provided exists. Do you like to add the content to existing file?',
      'append',
      'confirm'
    );
    if (!prompt.append) {
      fileName = generateFileName();
    }
    console.log(`File will be saved as ${fileName}`);
  }
  return fileName;
}

async function saveFile(content, fileName = generateFileName()) {
  try {
    fileName = path.join(__dirname, fileName);
    await fs.appendFile(fileName, `${content}\n`);
    console.log(`File saved!`);
  } catch (err) {
    console.error(`Error in saving file: ${err.message}`);
    throw new Error(`Error in saving file: ${err.message}`);
  }
}

module.exports = {
  saveFile,
  makeRequest,
  fileNameCheck,
};
