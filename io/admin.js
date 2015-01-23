/**
 * io route
 *
 */

var models = require("../models");

module.exports = function () {
  var io = this;

  var admin = io.of("/admin");

  function updateChannel(socket) {
    models.Channel.find().exec().then(function (channels) {
      socket.emit("update-channel", channels);
    }, function (err) {
      console.error(err);
    });
  }

  function updateSource(socket) {
    models.Source.find().exec().then(function (sources) {
      socket.emit("update-source", sources);
    }, function (err) {
      console.error(err);
    });
  }

  function updateScreen(socket) {
    models.Screen
    .find()
    .populate("channel")
    .exec().then(function (screens) {
      socket.emit("update-screen", screens);
    }, function (err) {
      console.error(err);
    });
  }

  admin.on("connection", function (socket) {
    // 管理画面接続時処理
    socket.on("join", function (info, callback) {
      console.log("socket.id:", socket.id, info);

      var data = {};

      models.Screen
      .find()
      .populate("channel")
      .exec()
      .then(function (screens) {
        data.screens = screens;
        return models.Channel.find().exec();
      }).then(function (channels) {
        data.channels = channels;
        return models.Source.find().exec();
      }).then(function (sources) {
        data.sources = sources;
        callback && callback(data);
      }, function (err) {
        console.error(err);
      });
    });

    socket.on("create-channel", function (data, callback) {
      if (! data || typeof data.name !== "string") {
        return callback && callback("data.name is not defined");
      }

      models.Channel.create(data).then(function () {
        callback && callback(null);
        updateChannel(admin);
      }, function (err) {
        callback && callback(err);
      });
    });

    socket.on("create-source", function (data, callback) {
      if (! data || typeof data.name !== "string") {
        return callback && callback("data.name is not defined");
      }

      models.Source.create(data).then(function () {
        callback && callback(null);
        updateSource(admin);
      }, function (err) {
        callback && callback(err);
      });
    });

    socket.on("update-screen", function (info, callback) {
      var channel = null;
      var screen = null;

      var channel_id_org = null;

      models.Channel.findOne({
        name: info.channel_name
      }).exec().then(function (_channel) {
        if (! _channel) {
          return callback && callback("channel not found.");
        }

        channel = _channel;
        return models.Screen.findById(info.screen_id).populate("channel").exec();
      }).then(function (_screen) {
        screen = _screen;
        channel_id_org = screen.channel;

        screen.name = info.screen_name;
        screen.channel = channel;
        return screen.save();
      }).then(function () {
        updateScreen(admin);

        // update screen front-end
        screen = screen.toJSON();
        screen.channel = channel.toJSON();
        io.to(screen.socket_id).emit("update", screen);

        if (String(channel_id_org) === String(channel._id)) {
          return callback && callback("not modified", channel.toJSON());
        }

        var room_info = socket.adapter.sids[screen.socket_id];
        if (room_info) {
          Object.keys(room_info).filter(function (key) {
            return key !== screen.socket_id && key === true;
          }).forEach(function (room) {
            io.to(screen.socket_id).leave(room);
          });
        }
        console.log("join", screen.name, channel.name);
        io.to(screen.socket_id).join(channel.name);
        callback && callback(null, screen.toJSON());
      }, function (err) {
        callback && callback(err);
      });
    });

    socket.on("remove-screen", function (_id, callback) {
      if (typeof _id !== "string") {
        return callback && callback("_id is not defined.");
      }

      models.Screen.findByIdAndRemove(_id).exec().then(function () {
        callback && callback(null);
        updateScreen(admin);
      }, function (err) {
        callback && callback(err);
      });
    });

    socket.on("remove-channel", function (_id, callback) {
      if (typeof _id !== "string") {
        return callback && callback("_id is not defined.");
      }

      models.Channel.findByIdAndRemove(_id).exec().then(function () {
        callback && callback(null);
        updateChannel(admin);
      }, function (err) {
        callback && callback(err);
      });
    });

    socket.on("remove-source", function (_id, callback) {
      if (typeof _id !== "string") {
        return callback && callback("_id is not defined.");
      }

      models.Source.findByIdAndRemove(_id).exec().then(function () {
        callback && callback(null);
        updateSource(admin);
      }, function (err) {
        callback && callback(err);
      });
    });

    socket.on("reload", function (socket_id, callback) {
      if (typeof socket_id !== "string") {
        return callback && callback("socket_id is not defined.");
      }

      io.to(socket_id).emit("reload");
    });

    socket.on("notify", function (info, callback) {
      if (! info || ! info.channel || ! info.channel.name) {
        return callback && callback("info.channel.name is not defined.");
      }
      if (info.message === "") {
        delete info.sound;
      }
      console.log("notify", info.channel.name);
      io.to(info.channel.name).emit("notify", {
        sound: info.sound || null,
        message: info.message
      });
    });

    socket.on("data", function (data) {
      io.to(data.channel).emit("data", {
        data: data.data
      });
    });
  });
};
