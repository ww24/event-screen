/**
 * Event Screen
 * admin control panel ui
 */
/* globals Vue, io */

Vue.config.delimiters = ["[", "]"];

var socket = io.connect("/admin");

socket.on("data", function (data) {
  console.log(data);
});

(function () {

  var vm = new Vue({
    data: {
      slides: []
    },
    created: function () {
      this.$on("create-channel", function (data) {
        if (! data) {
          return this.$broadcast("create-channel");
        }

        socket.emit("create-channel", data, function (err) {
          if (err) {
            return console.error(err);
          }

          // true の時 modal が閉じられる
          vm.$broadcast("create-channel", true);
        });
      });

      this.$on("create-source", function (data) {
        if (! data) {
          return this.$broadcast("create-source");
        }

        socket.emit("create-source", data, function (err) {
          if (err) {
            return console.error(err);
          }

          // true の時 modal が閉じられる
          vm.$broadcast("create-source", true);
        });
      });

      this.$on("create-message", function (data, channel) {
        if (! data) {
          return this.$broadcast("create-message", data, channel);
        }

        console.log(data);

        socket.emit("notify", data, function (err) {
          if (err) {
            return console.error(err);
          }

          // true の時 modal が閉じられる
          vm.$broadcast("create-message", true);
        });
      });

      this.$on("update-screen", function (screen) {
        socket.emit("update-screen", {
          channel_name: screen.channel.name,
          screen_name: screen.name,
          screen_id: screen._id
        }, function (err) {
          if (err) {
            return console.error(err);
          }
        });
      });

      this.$on("remove-screen", function (screen) {
        socket.emit("remove-screen", screen._id, function (err) {
          if (err) {
            return console.error(err);
          }
        });
      });

      this.$on("remove-source", function (source) {
        socket.emit("remove-source", source._id, function (err) {
          if (err) {
            return console.error(err);
          }
        });
      });

      this.$on("remove-channel", function (channel) {
        socket.emit("remove-channel", channel._id, function (err) {
          if (err) {
            return console.error(err);
          }
        });
      });

      this.$on("reload", function (screen) {
        socket.emit("reload", screen.socket_id, function (err) {
          if (err) {
            return console.error(err);
          }
        });
      });

      this.$on("notify", function (info) {
        socket.emit("notify", info, function (err) {
          if (err) {
            return console.error(err);
          }
        });
      });
    },
    methods: {
    }
  });

  vm.$mount(document.body);

  socket.on("connect", function () {
    socket.emit("join", {}, function (data) {
      vm.$broadcast("update-screen", data.screens);
      vm.$broadcast("update-channel", data.channels);
      vm.$broadcast("update-source", data.sources);
    });
  }).on("error", function (err) {
    console.error(err);
  });

  socket.on("update-screen", function (screens) {
    vm.$broadcast("update-screen", screens);
  }).on("update-channel", function (channels) {
    vm.$broadcast("update-channel", channels);
  }).on("update-source", function (sources) {
    vm.$broadcast("update-source", sources);
  });

})();
