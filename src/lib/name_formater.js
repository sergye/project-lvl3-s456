import url from 'url';
import path from 'path';

export const formatPath = (address) => {
  const { host, pathname } = url.parse(address);
  const trimmedPath = pathname !== '/' ? `${host}${pathname}` : `${host}`;
  return `${trimmedPath.replace(/[^A-Za-z]+/g, '-')}`;
};

const getPageName = urlPath => `${formatPath(urlPath)}.html`;

const getFolderName = urlPath => `${formatPath(urlPath)}_files`;

const getFileName = (link) => {
  const urlPath = url.parse(link).path;
  const pathObj = path.parse(urlPath);
  const fullPath = `${pathObj.dir}/${pathObj.name}`;
  const fileExt = pathObj.ext === '' ? '.html' : pathObj.ext;
  return `${fullPath.split(/[^A-Z, a-z, 0-9]/g).filter(e => e).join('-')}${fileExt}`;
};

const getFullLink = (pageURL, link) => {
  const { protocol, host } = url.parse(pageURL);
  const {
    protocol: linkProtocol, host: linkHost, pathname: linkPath, search: linkSearch,
  } = url.parse(link);
  const resProtocol = linkProtocol || protocol;
  const resHost = linkHost || host;

  return url.format({
    protocol: resProtocol, host: resHost, pathname: linkPath, search: linkSearch,
  });
};

const getLocalLink = (dir, link) => path.join(dir, getFileName(link));

const funcs = {
  getPageName, getFolderName, getFileName, getFullLink, getLocalLink,
};

export default (type, uri, link) => funcs[type](uri, link);
