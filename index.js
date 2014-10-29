var EventEmitter = require('events').EventEmitter
var util = require('util')
var fs = require('fs')
var path = require('path')
var cp = require('child_process')
var mkdirp = require('mkdirp')
var ls = require('ls-r')

var requiredOpts = ['source', 'dest', 'command']

function FolderProcessor(opts){
	var self = this;
	EventEmitter.call(this)

	this.opts = opts || {}
	requiredOpts.forEach(function(o){
		if(!self.opts[o]){
			throw new Error(o + ' option required')
		}
	})

}

util.inherits(FolderProcessor, EventEmitter)

FolderProcessor.prototype.convertFile = function(source, target, done){
	var self = this;
	var dirname = path.dirname(target)
	mkdirp(dirname, function(){
		var inFile = fs.createReadStream(source)
		var outFile = fs.createWriteStream(target)

		var proc = cp.spawn(self.opts.command, self.opts.args || [], {
			stdio:['pipe', 'pipe', process.stderr]
		})

		inFile.pipe(proc.stdin)
		proc.stdout.pipe(outFile)

		proc.on('error', done)
		proc.on('close', done)	
	})
}

FolderProcessor.prototype.run = function(done){
	var self = this;
	ls(self.opts.source, function(err, files){

		files = files.filter(function(file){
			return self.opts.filter ? self.opts.filter(file) : true
		})
		
		function nextFile(err){
			if(err) return done(err)
			if(files.length<=0){
				return done()
			}

			var file = files.shift()
			var target = file.replace(self.opts.source, self.opts.dest)

			target = self.opts.rename ? self.opts.rename(target) : target

			self.emit('file', file, target)

			self.convertFile(file, target, nextFile)
		}

		nextFile()
	})

}

module.exports = function(opts){
	return new FolderProcessor(opts)
}
/*

var srcFolder = path.join(__dirname, '..', 'templates', 'src')
var targetFolder = path.join(__dirname, '..', 'templates', 'build')

function convertFile(file, target, done){
	var dirname = path.dirname(target)
	mkdirp(dirname, function(){
		var out = fs.createWriteStream(target)
		var proc = cp.spawn('mercury-jsx', [
			file
		], {
			stdio:['ignore', out, 'inherit']
		})
		proc.on('error', done)
		proc.on('done', done)	
	})
}

ls(srcFolder, function(err, files){

	files = files.filter(function(file){
		return file.match(/\.jsx$/)
	})
	
	function nextFile(){
		if(files.length<=0){
			console.log('done')
			process.exit()
		}

		var file = files.shift()
		var target = file.replace(srcFolder, targetFolder)
		target = target.replace(/\.jsx/, '.js')

		console.log(file + ' -> ' + target)
		process.exit()
		convertFile(file, nextFile)
	}

	nextFile()
})
*/