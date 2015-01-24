/**
 * Event Screen
 * v0.0.1
 */

var express = require("express"),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    csrf = require("csurf"),
    MongoStore = require("connect-mongo")(session),
    hogan = require("hogan-express"),
    passport = require("passport"),
    path = require("path"),
    routes = require("./routes"),
    ioRoute = require("./io"),
    config = require("config"),
    fs = require("fs");

var app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http);

// express settings
app.disable("x-powered-by");
app.set("port", process.env.PORT || config.server.port || 3000);

// view settings
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "html");
app.set("layout", "layout");
app.set("partials", function (dirs) {
  var partials = {};

  dirs.forEach(function (dir) {
    fs.readdirSync(path.join(app.get("views"), dir)).forEach(function (file) {
      var partial = path.basename(file, "." + app.get("view engine"));
      if (~ partial.indexOf(".")) return;

      partials[partial] = path.join(dir, partial);
    });
  });

  return partials;
}(["partials", "templates"]));
app.locals.title = "Event Screen";
app.engine("html", hogan);

// middleware
app.use(express.static(path.resolve(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
  name: config.session.name,
  cookie: config.session.cookie,
  secret: config.session.secret,
  store: new MongoStore({
    db: config.db.name,
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.pass
  })
}));
app.use(csrf());
app.use(function (req, res, next) {
  res.locals._csrf = req.csrfToken();
  next();
});

// passport settings
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

// load routes
app.use(routes);
ioRoute.call(io);

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    console.error(err);

    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: err
    });
  });
} else {
  process.on("uncaughtException", function (err) {
    console.error(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error(err);

  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: null
  });
});

// start server
http.listen(app.get("port"), function () {
  console.log("Event Screen Server started at " + app.get("port"));
});
