#!/usr/bin/env node
import program from 'commander';
import pageLoader from '../index';
import pjson from '../../package.json';

program
  .version(pjson.version)
  .description('Download page to given location')
  .arguments('<url>')
  .option('-o, --output [path_to_save]', 'Path to save files')
  .action((url) => {
    pageLoader(url, program.output)
      .then(res => console.log(res))
      .catch(error => console.log(error));
  })
  .parse(process.argv);

if (!program.args.length) program.help();
