import cheerio from 'cheerio';
import _ from 'lodash';

const attributes = {
  a: 'href',
  link: 'href',
  script: 'src',
  img: 'src',
};

export default (data) => {
  const $ = cheerio.load(data);
  const urls = _.flatMap(['a', 'link', 'script', 'img'], item => $(item).map((i, el) => $(el).attr(attributes[item])).get().filter(el => el[0] === '/' && el.length > 1)
    .filter(el => el[1] !== '/'));
  return urls;
};
