const inquirer = require('inquirer');
const fs = require('fs').promises;


function parseToJson(param) {
  try {
    param = JSON.parse(param);
  } catch (error) {
    console.log(`Error in parsing param to JSON: ${error.message}`);
  }
  return param;
}


function stringifyObject(param) {
  try {
    if (typeof param === 'object') {
      param = JSON.stringify(param);
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

async function checkFileExists(file) {
  return fs
    .access(file)
    .then(() => true)
    .catch(() => false);
}

module.exports = {
  prompMessage,
  stringifyObject,
  parseToJson,
  generateFileName,
  checkFileExists
};