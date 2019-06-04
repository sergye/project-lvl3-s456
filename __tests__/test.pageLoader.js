import nock from 'nock';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';
import pageLoad from '../src';

describe('Resorces download test', () => {
  const address = 'http://localhost';
  const tempDir = os.tmpdir();
  const sourcePageDir = path.resolve('./__tests__/__fixtures__/');

  const match = async (objToMatch) => {
    const dataList = {
      resultPage: await fs.readFile(path.resolve(sourcePageDir, 'resultPage.html'), 'utf-8'),
      sourcePage: await fs.readFile(path.resolve(sourcePageDir, 'sourcePage.html'), 'utf-8'),
      script: await fs.readFile(path.resolve(sourcePageDir, 'hello.js')),
      link: await fs.readFile(path.resolve(sourcePageDir, 'coffee-icon.ico')),
      deepData: await fs.readFile(path.resolve(sourcePageDir, 'butterfly.jpg')),
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
      await pageLoad(address, tempDir);
      const resultPage = await fs.readFile(path.resolve(tempDir, 'localhost.html'), 'utf8');
      expect(resultPage).toBe(await match('resultPage'));
      const script = await fs.readFile(path.resolve(tempDir, 'localhost_files', 'hello.js'));
      expect(script).toStrictEqual(await match('script'));
      const link = await fs.readFile(path.resolve(tempDir, 'localhost_files', 'coffee-icon.ico'));
      expect(link).toStrictEqual(await match('link'));
      const deepData = await fs.readFile(path.resolve(tempDir, 'localhost_files', 'assets-butterfly.jpg'));
      expect(deepData).toStrictEqual(await match('deepData'));
    } catch (error) {
      throw error;
    }
  });
});
