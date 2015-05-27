'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lazyJs = require('lazy.js/');

var _lazyJs2 = _interopRequireDefault(_lazyJs);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _predicates = require('predicates');

var _predicates2 = _interopRequireDefault(_predicates);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var OPTIONS = {
  srcDir: 'src/',
  destDir: 'dest/',
  encode: 'utf-8',
  ext: '.html'
};

var Domtage = (function () {
  function Domtage(options, recipe, template) {
    var _this = this;

    _classCallCheck(this, Domtage);

    if (_predicates2['default'].arr(recipe)) {

      this.generate = function () {
        (0, _lazyJs2['default'])(recipe).map(function (recipe) {
          return new Domtage(options, recipe, template).generate();
        }).value();
      };
    } else {

      this.opts = (0, _lazyJs2['default'])(options || {}).assign(OPTIONS).value();
      this.skipGen = _predicates2['default']['true'](recipe.skipGen);
      this.layoutDir = _predicates2['default']['true'](recipe.cwd) ? _path2['default'].join(this.opts.srcDir, _path2['default'].dirname(recipe.name)) : this.opts.srcDir;
      this.layouts = _predicates2['default'].arr(recipe.layouts) ? recipe.layouts : [];
      this.patterns = _predicates2['default'].arr(recipe.patterns) ? recipe.patterns : [];
      this.src = _cheerio2['default'].load(template || _fsExtra2['default'].readFileSync(this.srcPath(recipe.name), { encoding: this.opts.encode }), { decodeEntities: false });
      this.dest = this.destPath(recipe.name);

      this.generate = function () {
        (0, _lazyJs2['default'])(_this.layouts).map(function (layout) {
          return (0, _lazyJs2['default'])(layout).pairs().flatten().value();
        }).map(function (pair) {
          console.log('selector: ' + pair[0]);
          console.log('template: ' + _this.layoutPath(pair[1]) + '\n');
          try {
            pair[1] = _fsExtra2['default'].readFileSync(_this.layoutPath(pair[1]), _this.opts.encode);
          } catch (e) {
            console.log(e);
            return null;
          }
          return pair;
        }).compact().each(function (pair) {
          var selector = pair.shift();
          _this.src(selector).replaceWith(pair.shift());
        });

        _this.output();
        new Domtage(_this.opts, _this.patterns, _this.src.html()).generate();
      };
    }
  }

  _createClass(Domtage, [{
    key: 'srcPath',
    value: function srcPath(filepath) {
      return _path2['default'].join(this.opts.srcDir, '' + filepath + '' + this.opts.ext);
    }
  }, {
    key: 'layoutPath',
    value: function layoutPath(filepath) {
      return _path2['default'].join(this.layoutDir, '' + filepath + '' + this.opts.ext);
    }
  }, {
    key: 'destPath',
    value: function destPath(filepath) {
      return _path2['default'].join(this.opts.destDir, '' + filepath + '.html');
    }
  }, {
    key: 'output',
    value: function output() {
      if (this.skipGen) {
        console.log('skip generating: ' + this.dest);
        return;
      }
      console.log(this.dest);
      _fsExtra2['default'].outputFileSync(this.dest, this.src.html());
      console.log('generate: ' + this.dest);
    }
  }], [{
    key: 'defaultOpts',
    value: function defaultOpts() {
      return OPTIONS;
    }
  }]);

  return Domtage;
})();

exports['default'] = Domtage;
module.exports = exports['default'];
