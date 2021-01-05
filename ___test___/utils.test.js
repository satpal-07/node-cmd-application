const utils = require('../utils');

describe('Testing for functions written in Utils', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });


  test('Should generate fila name using date now', async () => {
    const mockDate = new Date(1466424490000);
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    const generatedFileName = utils.generateFileName();
    expect(generatedFileName).toEqual(mockDate.getTime() + '.txt');
    spy.mockRestore();
  });

  test('Should parse the string json data', async () => {
    const dataJson = '{"data":"Test data"}';
    const parsedData = utils.parseToJson(dataJson);
    expect(parsedData).toEqual(JSON.parse(dataJson));
  });

  test('Should fail parsing data and return same', async () => {
    const dataJson = 'this is string test data';
    const parsedData = utils.parseToJson(dataJson);
    expect(parsedData).toEqual(dataJson);
  });

  test('Should fail parsing data and return same', async () => {
    JSON.stringify = jest.fn().mockImplementationOnce(() => {
      throw new Error('Test Error');
    });
    const parsedData = utils.stringifyObject({});
    expect(parsedData).toEqual({});
  });


  test('Should return false when no file is found', async () => {
    
    const fileName = 'text.txt';
    const isFileFound = await utils.checkFileExists(fileName);
    
    expect(isFileFound).toEqual(false);
  });
  
});
