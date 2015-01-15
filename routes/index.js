/**
 * Index Route
 *
 */

var express = require("express");
var router = express.Router();

var loader = require("../libs").loader;

var routes = loader.load(__dirname);
Object.keys(routes).forEach(function (route_path) {
  router.use("/" + route_path, routes[route_path]);
});

// GET / のルート
router.get("/", function (req, res) {
  res.render("index");
});

module.exports = router;
