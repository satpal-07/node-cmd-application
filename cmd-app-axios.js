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
    console.log(result.status);
    return result.data;
  } catch (error) {
    console.log(`Error in making api call: ${error.message}`);
    throw new Error(`Error in calling API: ${error.message}`);
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
    await fs.writeFile(fileName, content);
  } catch (err) {
    console.error(`Error in saving file: ${err.message}`);
    throw new Error(`Error in saving file: ${err.message}`);
  }
}



module.exports = {
  saveFile,
  makeRequest,
};
