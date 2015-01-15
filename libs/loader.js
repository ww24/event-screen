/**
 * Node.js module loader
 */

var fs = require("fs"),
    path = require("path");

function loader(dirpath) {
  var libs = {};

  fs.readdirSync(dirpath).forEach(function (file) {
    var module = path.basename(file, ".js");
    if (module === "index") return;

    libs[module] = require(path.join(dirpath, module));
  });

  return libs;
}

exports.load = loader;
