#!/usr/bin/env node
import program from 'commander';
import pageLoader from '../index';
import pjson from '../../package.json';

program
  .version(pjson.version)
  .description('Download page to specified location')
  .arguments('<url>')
  .option('-o, --output [path_to_save]', 'Path to download files', process.cwd())
  .action((url) => {
    pageLoader(url, program.output)
      .then(res => console.log(res))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  })
  .parse(process.argv);

if (!program.args.length) program.help();
