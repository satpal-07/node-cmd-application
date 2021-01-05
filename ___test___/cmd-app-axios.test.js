jest.mock('axios');
jest.unmock('mock-stdin');

const fs = require('fs');
const path = require('path');
const cmdApp = require('../cmd-app-axios');
const testFileName = 'test.txt';
const testData = '{"data":{"response": "Test data"}}';
const combinedFileName = path.join(__dirname, '../' + testFileName);
const axios = require('axios');
let stdin;

describe('checking save file function', () => {
  beforeAll(() => {
    if (fs.existsSync(combinedFileName)) fs.unlinkSync(combinedFileName);
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  afterAll(() => {
    if (fs.existsSync(combinedFileName)) fs.unlinkSync(combinedFileName);
  });

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();
  });

  test('Should save the file with provided content', async () => {
    await cmdApp.saveFile(testData, testFileName);
    const readFile = fs.readFileSync(combinedFileName, { encoding: 'utf8' });
    expect(fs.existsSync(combinedFileName)).toBe(true);
    expect(readFile).toBe(`${testData}\n`);
  });

  test('Should append the file with data after confirming', async () => {
    await cmdApp.saveFile(testData, testFileName);
    const readFile = fs.readFileSync(combinedFileName, {
      encoding: 'utf8',
    });
    expect(fs.existsSync(combinedFileName)).toBe(true);
    expect(readFile).toBe(`${testData}\n${testData}\n`);
  });

  test('Should return the new file name when file is found and user types "n"', async () => {
    let interval = setInterval(() => {
      stdin.send(`n\r`);
    }, 0);
    const returnedFileName = await cmdApp.fileNameCheck(combinedFileName);
    clearInterval(interval);
    expect(returnedFileName).not.toBe(combinedFileName);
  });

  test('Should return the same file name when file is found and user types "y"', async () => {
    let interval = setInterval(() => {
      stdin.send(`y\r`);
    }, 0);
    const returnedFileName = await cmdApp.fileNameCheck(combinedFileName);
    clearInterval(interval);
    expect(returnedFileName).toBe(combinedFileName);
  });
});

describe('checking for functions written in cmd-app', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });
  afterEach(() => {
    // to reset the request after each test
    axios.mockReset();
  });

  test('Should get response from the api', async () => {
    axios.mockImplementationOnce(() => Promise.resolve(testData));
    const response = await cmdApp.makeRequest('/randomurl', 'get');
    expect(response).toEqual(testData.data);
  });

  test('Should return error', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({ message: 'Not Allowed' })
    );
    try {
      await cmdApp.makeRequest('/randomurl', 'get');
    } catch (error) {
      expect(error.message).toEqual('Error in calling API: Not Allowed');
    }
  });
});

describe('Testing error thrown in the save file function', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });
  test('Should throw an error', async () => {
    fs.promises.appendFile = jest.fn().mockImplementationOnce(() => {
      throw new Error('test error');
    });
    try {
      await cmdApp.saveFile(testData);
    } catch (error) {
      expect(error.message).toBe('Error in saving file: test error');
    }
  });
});
