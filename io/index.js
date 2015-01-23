/**
 * io route
 *
 */

var models = require("../models");

var admin = require("./admin");
var sources = require("./sources");

module.exports = function () {
  var io = this;

  admin.call(io);
  sources.twitter.call(io, "#ggjsap", "twitter");

  // // load sources
  // models.Source.find({
  //   type: "tweet"
  // }).exec().then(function (source) {
  //   return models.Channel.find({
  //     source: source
  //   }).populate("source");
  // }).then(function (channels) {
  //   console.log(channel);
  //   sources.twitter.call(io, channel.source.url, channel.name);
  // });

  // set offline
  models.Screen.find().exec().then(function (screens) {
    screens.forEach(function (screen) {
      screen.status = "offline";
      screen.save();
    });
  });

  io.on("connection", function (socket) {
    // スクリーン追加時処理
    socket.on("join", function (info, callback) {
      if (! info.name && ! info.screen_id || typeof info.name !== "string" && typeof info.screen_id !== "string") {
        return callback && callback(new Error("name is not defined."));
      }

      var promise = null;

      if (info.screen_id) {
        promise = models.Screen.findByIdAndUpdate(info.screen_id, {
          socket_id: socket.id,
          status: "online"
        }, {
          upsert: true
        }).populate("channel").exec().then(function (screen) {
          screen = screen.toJSON();
          console.log("updated:", screen._id);

          if (screen.channel && screen.channel.name) {
            socket.join(screen.channel.name);
          }

          callback && callback(null, screen);
        });
      } else {
        promise = models.Screen.create({
          socket_id: socket.id,
          name: info.name,
          status: "online"
        }).then(function (screen) {
          screen = screen.toJSON();
          console.log("created:", screen._id);

          callback && callback(null, screen);
        });
      }

      promise.then(function () {
        return models.Screen
        .find()
        .populate("channel")
        .exec();
      }).then(function (screens) {
        io.of("/admin").emit("update-screen", screens);
      }, function (err) {
        console.error(err);
        callback && callback(err);
      });
    });

    socket.on("disconnect", function () {
      models.Screen.update({
        socket_id: socket.id
      }, {
        status: "offline"
      }).exec().then(function () {
        return models.Screen
        .find()
        .populate("channel")
        .exec();
      }).then(function (screens) {
        io.of("/admin").emit("update-screen", screens);
      }, function (err) {
        console.error(err);
      });
    });
  });
};
