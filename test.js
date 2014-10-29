#!/usr/bin/env node
var fs = require('fs')
var tape = require('tape')
var processFolder = require('./')
var wrench = require('wrench')
var path = require('path')

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
	t.end()
})

tape('is an event listener', function(t){
	var proc = getProcessor()

	t.equal(typeof(proc.on), 'function', 'is event listener')
	t.end()
})

tape('process some .jsx files', function(t){

	wrench.rmdirSyncRecursive(__dirname + '/fixtures/build', true)

	var proc = getProcessor()

	proc.run(function(err){
		if(err) t.fail(err)

		var file1 = fs.readFileSync(path.join(__dirname, 'fixtures', 'build', 'basic.js'), 'utf8')
		var file2 = fs.readFileSync(path.join(__dirname, 'fixtures', 'build', 'subfolder', 'apples.js'), 'utf8')

		t.ok(file1.indexOf('h("div", {class:"hello"}, ["This is HTML!"])')>=0, 'file 1 matches')
		t.ok(file2.indexOf('h("div", {class:"red"}, ["apples"])')>=0, 'file 2 matches')

		t.end()
	})
})