'use strict';

var assert = require('power-assert');
var _ = require('lazy.js');
var fs = require('fs-extra');
var is = require('predicates');
var YAML = require('js-yaml');
var Domtage = require('../lib/domtage');

describe('Domtage:', function(){
  before(function(){
    process.chdir(process.env.ROOT_DIR || 'samples/');
    console.log('cwd: %s \n', process.cwd());
    fs.removeSync('dest');
  });

  describe('single recipe', function(){
    var recipe;
    var target;

    before(function(){
      recipe = YAML.safeLoad(fs.readFileSync('single.yml'));
      target = new Domtage({destDir: 'dest/single', ext: '.html'}, recipe);
      console.log(target.opts);
    });

    it('opts', function(){
      assert(is.plainObject(target.opts));
      assert.deepEqual(target.opts, {
        srcDir: 'src/',
        destDir: 'dest/single',
        encode: 'utf-8',
        ext: '.html'
      });
    });
    it('layout', function(){
      assert.deepEqual(target.layouts, recipe.layouts);
    });
    it('src', function(){
      assert.equal(target.src.html(), fs.readFileSync('src/single.html'));
    });
    it('dest', function(){
      assert((is.eq('dest/single/single.html')(target.dest)));
    });
    it('#generate()', function(){
      target.generate();
    })
  });

  describe('multi recipe', function(){
    var recipes;
    var target;

    before(function(){
      recipes = YAML.safeLoad(fs.readFileSync('multi.yml'));
      target = new Domtage(null, recipes);
    });

    it('#generate()', function(){
      target.generate();
    });
  });

  describe('skipGen option', function(){
    var recipes;
    var target;

    before(function(){
      recipes = YAML.safeLoad(fs.readFileSync('skipGen.yml'));
      target = new Domtage(null, recipes);
    });

    it('#generate()', function(){
      target.generate();
      fs.open('dest/skip_build.html', 'r', function(err, file){
        assert(file);
      });
      fs.open('dest/skip_build2.html', 'r', function (err, file) {
        assert(file);
      });
      fs.open('dest/skip.html', 'r', function(err){
        assert(err);
      });
      fs.open('dest/no_generate', 'r', function (err, file) {
        assert(err);
      });
    })
  });

  describe('cwd option', function(){
    var recipes;
    var target;

    before(function(){
      recipes = YAML.safeLoad(fs.readFileSync('cwd.yml'));
      target = new Domtage(null, recipes);
    });

    it('#generate()', function(){
      target.generate();
      fs.open('dest/cwdTest/index.html', 'r', function(err, file){
        assert(file);
      })
    });
  });
});
