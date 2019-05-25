import fs from 'mz/fs';
import path from 'path';
import debug from 'debug';
import axios from './lib/axios';
import getName from './lib/name_formater';
import parseLinks from './lib/link_parcer';
import showError from './lib/error_informer';
import loadResources from './lib/resource_loader';

const log = debug('page-loader:main');

export default (url, outputPath = '.') => {
  const pageName = path.resolve(outputPath, getName('getPageName', url));
  const recourcesDir = path.resolve(outputPath, getName('getFolderName', url));
  log(`Start page-loader \n  url = ${url} \n  outputPath = ${outputPath}`);

  return axios
    .get(url)
    .then(result => result.data)
    .then((data) => {
      const links = parseLinks(data);
      const fullLinks = links.map(link => getName('getFullLink', url, link));
      const localPageData = links.reduce((acc, link) => acc.replace(link, getName('getLocalLink', recourcesDir, link)), data);
      return Promise.all([
        loadResources(fullLinks, recourcesDir),
        fs.writeFile(pageName, localPageData)]);
    })
    .then(() => `OK: Data has been downloaded from ${url} to ${pageName}\n`)
    .catch(error => showError(url, error));
};
