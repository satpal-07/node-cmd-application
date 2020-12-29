jest.mock('axios');
jest.unmock('mock-stdin');

const fs = require('fs');
const path = require('path');
const cmdApp = require('../cmd-app-axios');
const testFileName = 'test.txt';
const testData = {
  data: {
    response: 'Test data',
  },
};
const secondTestFileName = 'test-second.txt';
let stdin;
const combinedFileName = path.join(__dirname, '../' + testFileName);
const secondCombinedFileName = path.join(__dirname, '../' + secondTestFileName);
const axios = require('axios');

describe('checking save file function', () => {
  beforeAll(() => {
    if (fs.existsSync(combinedFileName)) fs.unlinkSync(combinedFileName);
    if (fs.existsSync(secondCombinedFileName))
      fs.unlinkSync(secondCombinedFileName);
  });

  afterAll(() => {
    if (fs.existsSync(combinedFileName)) fs.unlinkSync(combinedFileName);
    if (fs.existsSync(secondCombinedFileName))
      fs.unlinkSync(secondCombinedFileName);
  });

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();
  });

  test('Should save the file with provided content', async () => {
    await cmdApp.saveFile(testData, testFileName);
    const readFile = fs.readFileSync(combinedFileName, { encoding: 'utf8' });
    expect(fs.existsSync(combinedFileName)).toBe(true);
    expect(readFile).toBe(JSON.stringify(testData));
  });

  test('Should save the file with provided content', async () => {
    process.nextTick(() => {
      stdin.send(`${secondTestFileName}\r`);
    });
    await cmdApp.saveFile(testData, testFileName);
    const readFile = fs.readFileSync(secondCombinedFileName, {
      encoding: 'utf8',
    });
    expect(fs.existsSync(secondCombinedFileName)).toBe(true);
    expect(readFile).toBe(JSON.stringify(testData));
  });
});

describe('checking for functions written in cmd-app', () => {
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
    axios.mockImplementationOnce(() => Promise.reject('Not Allowed'));
    try {
      await cmdApp.makeRequest('/randomurl', 'get');
    } catch (error) {
      expect(error.message).toEqual('Error in calling API');
    }
  });
});

describe('Testing error thrown in the save file function', () => {
  test('Should throw an error', async () => {
    fs.existsSync = jest.fn().mockImplementationOnce(() => {
      throw new Error('test error');
    });
    try {
      await cmdApp.saveFile(testData);
    } catch (error) {
      expect(error.message).toBe('Error in saving file');
    }
  });
});
