process-folder
==============

Loop recursively over files in a folder, pipe them to stdin of a command and write the output to a target folder.

[![Travis](http://img.shields.io/travis/binocarlos/process-folder.svg?style=flat)](https://travis-ci.org/binocarlos/process-folder)

## install

```
$ npm install process-folder
```

## usage

```js
var processFolder = require('process-folder')

var processor = processFolder({
	source:__dirname + '/fixtures/src',
	dest:__dirname + '/fixtures/build',
	command:'mercury-jsx',
	args:[],
	filter:function(file){
		return file.match(/\.jsx/)
	},
	rename:function(file){
		return file.replace(/\.jsx/, '.js')
	}
})

processor.on('file', function(source, target){
	console.log('processing: ' + path)
})

processor.run(function(err){
	console.log('all .jsx have been processed into .js')	
})
```

The above example will load all `.jsx` files from `__dirname + '/fixtures/src'` and pipe them via a `mercury-jsx`.

The results of each file will be written to `__dirname + '/fixtures/build'` with the .jsx suffix replaced with .js


## license

MIT