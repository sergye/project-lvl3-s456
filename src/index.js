import fs from 'mz/fs';
import path from 'path';
import axios from './lib/axios';
import getName from './lib/helpers';


export default (url, outputPath = '.') => {
  const fileName = getName(url);
  const filePath = path.resolve(outputPath, fileName);

  return axios
    .get(url)
    .then(result => result.data)
    .then(data => fs.writeFile(filePath, data))
    .then(() => `OK: Data has been downloaded from ${url} to ${filePath}\n`)
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          return Promise.reject(new Error(`ERROR: File isn't found by url ${error.config.url}\n`));
        }
      } else if (error.code === 'ENOTFOUND') {
        return Promise.reject(new Error(`ERROR: Unable to connect to given URL: ${error.config.url}\n`));
      } else if (error.code === 'ECONNREFUSED') {
        return Promise.reject(new Error(`ERROR: Connection to ${error.address} refused by server\n`));
      }

      console.log(error);
      return Promise.reject(new Error(`ERROR: ${error.code}\n`));
    });
};
