var babel = require('babel');

module.exports = function (wallaby) {
  return {
    files: [
      "lib/**/*.js",
      "domtage.js"
    ],
    tests: [
      "test/**/*Spec.js"
    ],
    testFramework: "mocha@2.1.0",
    compilers: {
      '**/*.js': wallaby.compilers.babel({
        babel: babel
      })
    },
    env: {
      type: "node",
      params: {
        env: "ROOT_DIR=" + __dirname + "/samples"
      }
    }
  }
};