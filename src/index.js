import fs from 'mz/fs';
import path from 'path';
import axios from './lib/axios';
import getName from './lib/helpers';
import showError from './lib/errors';

export default (url, outputPath = '.') => {
  const fileName = getName(url);
  const filePath = path.resolve(outputPath, fileName);

  return axios
    .get(url)
    .then(result => result.data)
    .then(data => fs.writeFile(filePath, data))
    .then(() => `OK: Data has been downloaded from ${url} to ${filePath}\n`)
    .catch(error => Promise.reject(new Error(showError(error))));
};
