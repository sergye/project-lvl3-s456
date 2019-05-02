import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import path from 'path';
import pageLoad from '../src';
import getName from '../src/lib/helpers';


const host = 'https://hexlet.io';
const resource = '/courses';
const testData = 'Some data';
const absentPageError = 'No such page';

describe('test page loader', () => {
  let tempDir;
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(`${os.tmpdir()}/`);
    nock(host)
      .get(resource)
      .reply(200, testData);
    nock(host)
      .get('/absent_page')
      .reply(404, absentPageError);
  });

  it('should download without errors', (done) => {
    const url = `${host}${resource}`;
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
    const url = `${host}/absent_page`;
    const expectedMessage = `ERROR: File isn't found by url ${url}\n`;
    try {
      await pageLoad(url, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });
});
