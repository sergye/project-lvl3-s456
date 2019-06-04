import { promises as fs } from 'fs';
import path from 'path';
import debug from 'debug';
import Listr from 'listr';
import axios from './lib/axios';
import getName from './lib/nameFormater';
import parseLinks from './lib/linkParser';
import showError from './lib/errorInformer';

const log = debug('page-loader:main');

const loadResources = (urls, dir) => {
  const getResource = (url, folder) => {
    axios.get(url, { responseType: 'arraybuffer' })
      .then(result => fs.writeFile(path.resolve(folder, getName('getFileName', url)), result.data))
      .catch(error => showError(url, error));
  };
  fs.mkdir(dir)
    .then(() => log(`Download started to directory: ${dir}`))
    .then(() => Promise.all(urls.map(url => getResource(url, dir))))
    .catch(error => (error.code === 'EEXIST' ? Promise.all(urls.map(url => getResource(url, dir))) : console.log(error.message)));
};

export default (url, outputPath = '.') => {
  const pageName = path.resolve(outputPath, getName('getPageName', url));
  const recourcesDir = path.resolve(outputPath, getName('getFolderName', url));
  log(`Start page-loader, url = ${url}, outputPath = ${outputPath}`);

  const tasks = new Listr([
    {
      title: 'Page loading',
      task: ctx => axios.get(url)
        .then((result) => {
          ctx.data = result.data;
        }),
    },
    {
      title: 'Resources loading',
      task: (ctx) => {
        const { data } = ctx;
        const links = parseLinks(data);
        const fullLinks = links.map(link => getName('getFullLink', url, link));
        const localPageData = links.reduce((acc, link) => acc.replace(link, getName('getLocalLink', recourcesDir, link)), data);
        return fs.writeFile(pageName, localPageData)
          .then(() => loadResources(fullLinks, recourcesDir))
          .then((results) => {
            ctx.msgs = results;
          });
      },
    },
  ]);

  return tasks.run()
    .then(ctx => ctx.result)
    .then(() => `OK: Data has been downloaded from ${url} to ${pageName}\n`)
    .catch(error => showError(url, error));
};
