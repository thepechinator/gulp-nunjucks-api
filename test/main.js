'use strict';

var should = require('should');
var gutil = require('gulp-util');
var nunjucksRender = require('../');
var fs = require('fs');
var path = require('path');

require('mocha');

var srcPath = path.resolve('test');

function getFile(filepath) {
  return new gutil.File({
    base: srcPath,
    cwd: 'test',
    path: filepath,
    contents: fs.readFileSync('test/' + filepath)
  });
}

function getExpected(filepath) {
  return fs.readFileSync('test/expected/' + filepath, 'utf8');
}

describe('gulp-nunjucks-api', function () {
  
  it('should render a html file', function (done) {
    var stream = nunjucksRender({ src: srcPath });
    var expected = getExpected('hello-world.html');
    var file = getFile('fixtures/hello-world.nunj');
    
    stream.once('data', function (output) {
      should.exist(output);
      should.exist(output.contents);
      path.extname(output.path).should.equal('.html');
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });
  
  it('should use nunjucks environment to resolve paths', function (done) {
    var stream = nunjucksRender({ src: srcPath });
    var expected = getExpected('child.html');
    var file = getFile('fixtures/child.nunj');
    
    stream.once('data', function (output) {
      should.exist(output);
      should.exist(output.contents);
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });
  
  it('should pass context data', function (done) {
    var stream = nunjucksRender({ data: { title: 'Overridden title' }, src: srcPath });
    var expected = getExpected('overridden-title.html');
    var file = getFile('fixtures/hello-world.nunj');
    
    stream.once('data', function (output) {
      should.exist(output);
      should.exist(output.contents);
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });
  
  it('should use gulp-data', function (done) {
    var stream = nunjucksRender({ src: srcPath });
    var expected = getExpected('overridden-title.html');
    var file = getFile('fixtures/hello-world.nunj');
    file.data = { title: 'Overridden title' };
    
    stream.once('data', function (output) {
      should.exist(output);
      should.exist(output.contents);
      output.data.title.should.equal('Overridden title');
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });
  
  it('should update context from gulp-data', function (done) {
    var stream = nunjucksRender({ data: { title: 'Title from context' }, src: srcPath });
    var expected = getExpected('merge-data.html');
    var file = getFile('fixtures/merge-data.nunj');
    file.data = { title: 'Title from data', text: 'Some text' };
    
    stream.once('data', function (output) {
      should.exist(output);
      should.exist(output.contents);
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });
  
  it('should create a new data context for each template', function (done) {
    var stream = nunjucksRender({ src: srcPath });
    var expected1 = getExpected('set.html');
    var expected2 = getExpected('hello-world.html');
    var file = getFile('fixtures/set.nunj');
    var file2 = getFile('fixtures/hello-world.nunj');
    
    stream.once('data', function (output) {
      // First file
      should.exist(output);
      should.exist(output.contents);
      output.path.should.equal(path.join('fixtures', 'set.html'));
      output.contents.toString().should.equal(expected1);
      
      stream.once('data', function (output) {
        // Second file
        should.exist(output);
        should.exist(output.contents);
        output.path.should.equal(path.join('fixtures', 'hello-world.html'));
        output.contents.toString().should.equal(expected2);
      });
      
      stream.write(file2);
      stream.end();
    });
    stream.on('finish', function () {
      done();
    });
    stream.write(file);

  });

});