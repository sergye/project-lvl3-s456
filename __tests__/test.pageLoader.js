import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import path from 'path';
import pageLoad from '../src';
import getName from '../src/lib/name_formater';

const host = 'https://hexlet.io';
const url = `${host}/courses`;

describe('test page loader', () => {
  let tempDir;
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(`${os.tmpdir()}/`);
    nock(host)
      .get('/courses')
      .reply(200, 'test data');
  });

  it('should download without errors', (done) => {
    const filePath = path.resolve(tempDir, getName('getPageName', url));
    const expectedMessage = `OK: Data has been downloaded from ${url} to ${filePath}\n`;

    return pageLoad(url, tempDir)
      .then((message) => {
        expect(message).toBe(expectedMessage);
      })
      .then(async () => {
        expect(await fs.readFile(filePath, 'utf8')).toBe('test data');
      })
      .then(done)
      .catch(done.fail);
  });

  it('should download to default folder "."', (done) => {
    const fileName = getName('getPageName', url);
    const filePath = path.resolve(path.dirname(fileName), fileName);
    const expectedMessage = `OK: Data has been downloaded from ${url} to ${filePath}\n`;

    return pageLoad(url)
      .then((message) => {
        expect(message).toBe(expectedMessage);
      })
      .then(async () => {
        expect(await fs.readFile(filePath, 'utf8')).toBe('test data');
      })
      .then(done)
      .catch(done.fail);
  });
});
