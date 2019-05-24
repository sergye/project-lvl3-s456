import fs from 'mz/fs';
import path from 'path';
import axios from './lib/axios';
import getName from './lib/name_formater';
import parseLinks from './lib/link_parcer';
import showError from './lib/error_informer';
import loadResources from './lib/resource_loader';

export default (pageURL, outputPath = '.') => {
  const pageName = path.resolve(outputPath, getName('getPageName', pageURL));
  const recourcesDir = path.resolve(outputPath, getName('getFolderName', pageURL));

  return axios
    .get(pageURL)
    .then(result => result.data)
    .then((data) => {
      const links = parseLinks(data);
      const fullLinks = links.map(link => getName('getFullLink', pageURL, link));
      const localPageData = links.reduce((acc, link) => acc.replace(link, getName('getLocalLink', recourcesDir, link)), data);
      return Promise.all([
        loadResources(fullLinks, recourcesDir),
        fs.writeFile(pageName, localPageData)]);
    })
    .then(() => `OK: Data has been downloaded from ${pageURL} to ${pageName}\n`)
    .catch(error => Promise.reject(new Error(showError(pageURL, error))));
};
