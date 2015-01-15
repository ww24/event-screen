/**
 * Create Database Connection & Load Models
 *
 */

var mongoose = require("mongoose");
var config = require("config");

var url = "mongodb://";

if (config.db.user && config.db.pass) {
  url += [config.db.user, config.db.pass].map(encodeURIComponent).join(":") + "@";
}

url += config.db.host + ":" + config.db.port + "/" + config.db.name;

// create MongoDB connection
mongoose.connect(url);

var loader = require("../libs").loader;
module.exports = loader.load(__dirname);
