'use strict';

require('assert');
var _ = require('lodash');
var should = require('should');

var app = require('./prepare');
var md = app.autodocs.parsers.markdown;

var chalk = {
  urls: { readme: 'https://raw.githubusercontent.com/chalk/chalk/master/readme.md' },
  language: 'javascript',
  aliases: undefined,
  parser: 'markdown',
  static: undefined,
  crawl: false,
};

describe('markdownParser', function () {

  after(function (done) {
    done();
  });

  it('should exist and be an object', function () {
    should.exist(md);
    md.should.be.type('object');
  });

  describe('.run', function () {
    
    it('should exist and be a function', function () {
      should.exist(md.run);
      md.run.should.be.type('function');
    });

    it('should import a library', function (done) {
      this.timeout(16000);
      md.run('chalk', chalk, function(err, data) {
        (typeof err).should.equal('undefined');
        done();
      })
    });

    it('should call a progress method', function (done) {
      this.timeout(16000);
      var opt = _.clone(chalk);
      var actions = {}
      opt.progress = function(data) {
        actions[data.action] = actions[data.action] || 0;
        actions[data.action]++;
      }
      md.run('chalk', opt, function(err, data) {
        (typeof err).should.equal('undefined');
        actions.fetch.should.be.above(0);
        actions.parse.should.be.above(0);
        actions.build.should.be.above(0);
        actions.write.should.be.above(0);
        done();
      })
    });

    it('should error on an invalid language', function () {
      this.timeout(6000);
      (function() {
        var opt = _.clone(chalk);
        opt.language = 'brainfuck';
        md.run('chalk', opt, function(err, data) {});
      }).should.throw(Error);
    });

  });
});

