import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import pageLoad from '../src';

const host = 'https://hexlet.io';

describe('test page loader', () => {
  let tempDir;
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(`${os.tmpdir()}/`);
  });

  it('should return Error 403', async () => {
    const expectedMessage = `Unable to download ${host}/forbidden_page\nERROR 403: Connection refused by server`;
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
    const expectedMessage = `Unable to download ${host}/absent_page\nERROR 404: Resource not found by url`;
    nock(host)
      .get('/absent_page')
      .reply(404);
    try {
      await pageLoad(`${host}/absent_page`, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });

  it('should return Error 503', async () => {
    const expectedMessage = `Unable to download ${host}/\nERROR 503: Service Temporarily Unavailable`;
    nock(host)
      .get('/')
      .reply(503);
    try {
      await pageLoad(`${host}/`, tempDir);
    } catch (error) {
      expect(error.message).toBe(expectedMessage);
    }
  });

  it('should return ENOTFOUND', async () => {
    const failLoadMessage = `Unable to download ${host}/wrong_resource\n`;
    const errorName = 'ENOTFOUND: Unable to connect to given URL';
    nock(host)
      .get('/wrong_resource')
      .replyWithError(errorName);
    try {
      await pageLoad(`${host}/wrong_resource`, tempDir);
    } catch (error) {
      expect(error.message).toBe(`${failLoadMessage}${errorName}`);
    }
  });

  it('should return ECONNREFUSED', async () => {
    const failLoadMessage = `Unable to download ${host}/forbidden_page\n`;
    const errorName = 'ECONNREFUSED: Connection refused by server';
    nock(host)
      .get('/forbidden_page')
      .replyWithError(errorName);
    try {
      await pageLoad(`${host}/forbidden_page`, tempDir);
    } catch (error) {
      expect(error.message).toBe(`${failLoadMessage}${errorName}`);
    }
  });

  it('should return ENOENT', async () => {
    const failLoadMessage = `Unable to download ${host}/absent_page\n`;
    const errorName = 'ENOENT: No such file or directory';
    nock(host)
      .get('/absent_page')
      .replyWithError(errorName);
    try {
      await pageLoad(`${host}/absent_page`, 'nonexistent directory');
    } catch (error) {
      expect(error.message).toBe(`${failLoadMessage}${errorName}`);
    }
  });

  it('should return EISDIR', async () => {
    const failLoadMessage = `Unable to download ${host}/\n`;
    const errorName = 'EISDIR: illegal operation on a directory';
    nock(host)
      .get('/')
      .replyWithError(errorName);
    try {
      await pageLoad(`${host}/`, `${tempDir}/test`);
    } catch (error) {
      expect(error.message).toBe(`${failLoadMessage}${errorName}`);
    }
  });
});
