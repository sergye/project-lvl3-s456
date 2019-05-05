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
  });

  it('should download without errors', (done) => {
    const fileName = getName(url);
    const filePath = path.resolve(tempDir, fileName);
    const expectedMessage = `OK: Data has been downloaded from ${url} to ${filePath}\n`;
    nock(host)
      .get(resource)
      .reply(200, testData);
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

  it('should return Error 400', async () => {
    const expectedMessage = 'ERROR 400: The request URL is invalid';
    nock(host)
      .get('not_a_url')
      .reply(400);
    try {
      await pageLoad('not_a_url', tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });

  it('should return Error 403', async () => {
    const expectedMessage = 'ERROR 403: Connection refused by server';
    nock(host)
      .get('/forbidden_page')
      .reply(403);
    try {
      await pageLoad(`${host}/forbidden_page`, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });

  it('should return Error 404', async () => {
    const expectedMessage = 'ERROR 404: Resource not found by url';
    nock(host)
      .get('/absent_page')
      .reply(404);
    try {
      await pageLoad(`${host}/absent_page`, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });

  it('should return ENOTFOUND', async () => {
    const expectedMessage = 'ENOTFOUND: Unable to connect to given URL';
    nock(host)
      .get('/wrong_resource')
      .replyWithError(expectedMessage);
    try {
      await pageLoad(`${host}/wrong_resource`, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });

  it('should return ECONNREFUSED', async () => {
    const expectedMessage = 'ECONNREFUSED: Connection refused by server';
    nock(host)
      .get('/forbidden_page')
      .replyWithError(expectedMessage);
    try {
      await pageLoad(`${host}/forbidden_page`, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });

  it('should return ENOENT', async () => {
    const expectedMessage = 'ENOENT: No such file or directory';
    nock(host)
      .get('/absent_page')
      .replyWithError(expectedMessage);
    try {
      await pageLoad(`${host}/absent_page`, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });
});
