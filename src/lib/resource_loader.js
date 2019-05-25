import fs from 'mz/fs';
import path from 'path';
import debug from 'debug';
import axios from './axios';
import getName from './name_formater';
import showError from './error_informer';

const log = debug('page-loader:resources');

const getResource = (url, dir) => {
  axios.get(url, { responseType: 'arraybuffer' })
    .then(result => fs.writeFile(path.resolve(dir, getName('getFileName', url)), result.data))
    .catch(error => showError(url, error));
};

export default (urls, dir) => {
  fs.exists(dir)
    .then(exists => (exists ? Promise.resolve() : fs.mkdir(dir)))
    .then(() => log(`Download started \nDirectory: ${dir}`))
    .then(() => Promise.all(urls.map(url => getResource(url, dir))))
    .then(() => log('Download finished'));
};
