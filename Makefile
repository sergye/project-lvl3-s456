install: 
		npm install

start: 
		npm run babel-node -- 'src/bin/page-loader.js'

lint: 
		npm run eslint .

publish: 
		npm publish

build:
		npm run build

test:
		npm test

test-watch:
		npm run test:watch