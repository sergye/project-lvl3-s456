import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import path from 'path';
import pageLoad from '../src';
import getName from '../src/lib/helpers';


const host = 'https://hexlet.io';
const resource = '/courses';
const testData = 'Some data';
const url = `${host}${resource}`;

describe('test page loader', () => {
  let tempDir;
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(`${os.tmpdir()}/`);
    nock(host)
      .get(resource)
      .reply(200, testData);
    nock(host)
      .get('/absent_page')
      .reply(404, 'Not Found');
    nock(host)
      .get('/')
      .replyWithError({ code: 'ENOTFOUND' });
    nock(host)
      .get('/')
      .reply(403, 'Forbidden');
  });

  it('should download without errors', (done) => {
    const fileName = getName(url);
    const filePath = path.resolve(tempDir, fileName);
    const expectedMessage = `OK: Data has been downloaded from ${url} to ${filePath}\n`;

    return pageLoad(url, tempDir)
      .then((message) => {
        expect(message).toBe(expectedMessage);
      })
      .then(async () => {
        expect(await fs.readFile(filePath, 'utf8')).toBe(testData);
      })
      .then(done)
      .catch(done.fail);
  });

  it('should return Error 404', async () => {
    const expectedMessage = `ERROR: File isn't found by url ${url}\n`;
    try {
      await pageLoad(url, tempDir);
    } catch (error) {
      expect(error.code).toBe(expectedMessage);
    }
  });

  it('should return ENOTFOUND', async () => {
    const expectedMessage = `ERROR: Unable to connect to given URL: ${url}\n`;
    try {
      await pageLoad(url, tempDir);
    } catch (error) {
      expect(error.code).toBe(expectedMessage);
    }
  });

  it('should return ECONNREFUSED', async () => {
    const expectedMessage = `ERROR: Connection to ${url} refused by server\n`;
    try {
      await pageLoad(url, tempDir);
    } catch (error) {
      expect(error.code).toBe(expectedMessage);
    }
  });

  it('should return some other Error', async () => {
    try {
      await pageLoad(url, tempDir);
    } catch (error) {
      expect(error.code).toBe(error.code);
    }
  });
});
