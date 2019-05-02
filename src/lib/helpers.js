export default url => `${url.split(/[^A-Z, a-z, 0-9]/g).filter(e => e).slice(1).join('-')}.html`;
