'use strict';

import path from 'path';
import _ from 'lazy.js/';
import fs from 'fs-extra';
import is from 'predicates';
import cheerio from 'cheerio';

const OPTIONS = {
  srcDir: 'src/',
  destDir: 'dest/',
  encode: 'utf-8',
  ext: '.html'
};

export default class Domtage {
  constructor(options, recipe, template) {
    if(is.arr(recipe)) {

      this.generate = () => {
        _(recipe).map((recipe)=> new Domtage(options, recipe, template).generate()).value();
      }
    }
    else {

      this.opts = _(options || {}).assign(OPTIONS).value();
      this.skipGen = is.true(recipe.skipGen);
      this.layoutDir = is.true(recipe.cwd) ? path.join(this.opts.srcDir, path.dirname(recipe.name)) : this.opts.srcDir;
      this.layouts = is.arr(recipe.layouts) ? recipe.layouts : [];
      this.patterns = is.arr(recipe.patterns) ? recipe.patterns : [];
      this.src = cheerio.load(template || fs.readFileSync(this.srcPath(recipe.name), {encoding: this.opts.encode}), {decodeEntities: false});
      this.dest = this.destPath(recipe.name);

      this.generate = () => {
        _(this.layouts)
          .map(layout => _(layout).pairs().flatten().value())
          .map((pair) => {
            console.log(`selector: ${pair[0]}`);
            console.log(`template: ${this.layoutPath(pair[1])}\n`);
            try {
              pair[1] = fs.readFileSync(this.layoutPath(pair[1]), this.opts.encode);
            }
            catch (e) {
              console.log(e);
              return null;
            }
            return pair;
          })
          .compact()
          .each((pair) => {
            var selector = pair.shift();
            this.src(selector).replaceWith(pair.shift());
          });

        this.output();
        new Domtage(this.opts, this.patterns, this.src.html()).generate();
      }
    }
  }

  static defaultOpts() {
    return OPTIONS;
  }

  srcPath(filepath) {
    return path.join(this.opts.srcDir, `${filepath}${this.opts.ext}`);
  }

  layoutPath(filepath) {
    return path.join(this.layoutDir, `${filepath}${this.opts.ext}`);
  }

  destPath(filepath) {
    return path.join(this.opts.destDir, `${filepath}.html`);
  }

  output() {
    if (this.skipGen) {
      console.log(`skip generating: ${this.dest}`);
      return;
    }
    console.log(this.dest);
    fs.outputFileSync(this.dest, this.src.html());
    console.log(`generate: ${this.dest}`);
  }
}