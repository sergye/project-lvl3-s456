install: 
		npm install

start: 
		npx babel-node -- 'src/bin/page-loader.js'

lint: 
		npx eslint .

publish: 
		npm publish

build:
		npm run build

test:
		npm test
