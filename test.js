#!/usr/bin/env node
var fs = require('fs')
var tape = require('tape')
var processFolder = require('./')

function getProcessor(){

	return processFolder({
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
}

tape('throw with bad options', function(t){
	t.throws(function(){
		processFolder()
	}, 'source option required', 'throw with bad options')
})

tape('is and event listener', function(t){
	var proc = getProcessor()

	t.equal(typeof(proc.on), 'function', 'is event listener')
	t.end()
})

tape('process the .jsx files', function(t){

	var proc = process({
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

	proc.run(function(err){
		if(err) t.fail(err)
		console.log('all .jsx have been processed into .js')
		t.end()
	})
})