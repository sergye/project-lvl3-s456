import nock from 'nock';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import os from 'os';
import pageLoad from '../src';

const readFile = promisify(fs.readFile);

describe('Resorces download test', () => {
  const address = 'http://localhost';
  const tempDir = os.tmpdir();
  const sourcePageDir = path.resolve('./__tests__/__fixtures__/');

  beforeAll(async () => {
    await pageLoad(address, tempDir);
  });

  const match = async (objToMatch) => {
    const dataList = {
      resultPage: await readFile(path.resolve(sourcePageDir, 'resultPage.html'), 'utf-8'),
      sourcePage: await readFile(path.resolve(sourcePageDir, 'sourcePage.html'), 'utf-8'),
      script: await readFile(path.resolve(sourcePageDir, 'hello.js')),
      link: await readFile(path.resolve(sourcePageDir, 'coffee-icon.ico')),
      deepData: await readFile(path.resolve(sourcePageDir, 'butterfly.jpg')),
    };
    return dataList[objToMatch];
  };

  beforeEach(async () => {
    nock(address)
      .get('/')
      .reply(200, await match('sourcePage'))
      .get('/hello.js')
      .reply(200, await match('script'))
      .get('/coffee-icon.ico')
      .reply(200, await match('link'))
      .get('/assets/butterfly.jpg')
      .reply(200, await match('deepData'))
      .get('/coffee-icon.ico')
      .reply(503);
  });

  it('should check how resources have been downloaded', async () => {
    try {
      const resultPage = await readFile(path.resolve(tempDir, 'localhost.html'), 'utf8');
      expect(resultPage).toBe(await match('resultPage'));
      const script = await readFile(path.resolve(tempDir, 'localhost_files', 'hello.js'));
      expect(script).toStrictEqual(await match('script'));
      const link = await readFile(path.resolve(tempDir, 'localhost_files', 'coffee-icon.ico'));
      expect(link).toStrictEqual(await match('link'));
      const deepData = await readFile(path.resolve(tempDir, 'localhost_files', 'assets-butterfly.jpg'));
      expect(deepData).toStrictEqual(await match('deepData'));
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  });

  it('should catch resource loader error', async () => {
    const expectedMessage = `Unable to download ${address}/\nERROR 503: Service Temporarily Unavailable`;
    try {
      await pageLoad(`${address}/`, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
      throw error;
    }
  });
});
