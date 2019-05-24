import nock from 'nock';
import path from 'path';
import fs from 'mz/fs';
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
      script: await fs.readFile(path.resolve(sourcePageDir, 'hello.js')).data,
      link: await fs.readFile(path.resolve(sourcePageDir, 'coffee-icon.ico')).data,
      deepData: await fs.readFile(path.resolve(sourcePageDir, 'butterfly.jpg')).data,
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

  it('# Should download resources', (done) => {
    pageLoad(address, tempDir)
      .then(() => fs.readFile(path.resolve(tempDir, 'localhost.html'), 'utf8'))
      .then(async data => expect(data).toBe(await match('resultPage')))
      .then(() => fs.readFile(path.resolve(tempDir, 'localhost_files', 'hello.js')))
      .then(async data => expect(data.data).toBe(await match('script')))
      .then(() => fs.readFile(path.resolve(tempDir, 'localhost_files', 'coffee-icon.ico')))
      .then(async data => expect(data.data).toBe(await match('link')))
      .then(() => fs.readFile(path.resolve(tempDir, 'localhost_files', 'assets-butterfly.jpg')))
      .then(async data => expect(data.data).toBe(await match('deepData')))
      .then(done)
      .catch(done.fail);
  });

  it('should catch resource loader error', async () => {
    const expectedMessage = `Unable to download ${address}/\nERROR 503: Service Temporarily Unavailable`;
    try {
      await pageLoad(`${address}/`, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });
});
