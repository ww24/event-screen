/**
 * Event Screen
 * screen side ui
 */
/* globals Vue, io, Sound */

Vue.config.delimiters = ["[", "]"];

(function (socket) {
  // sound preload
  var sounds = {
    notify: new Sound("/sound/se_pinponpan01.mp3")
  };

  var vm = new Vue({
    data: function () {
      return {
        connected: false,
        name: "",
        channel: "",
        tweets: [],
        message: ""
      };
    },
    created: function () {
      var path = location.pathname.slice(1).split("/");
      var is_screen = path[0] === "screen";
      if (is_screen) {
        this.join(null, path[1]);
      }

      this.$on("restore", function (channel) {
        channel.type = "tweet";
        var tweet_json = sessionStorage.getItem("tweets");
        // restore tweets stream
        if (channel.type === "tweet" && channel.name === sessionStorage.getItem("channel") && tweet_json) {
          console.log(JSON.parse(tweet_json));
          this.$data.tweets = this.$data.tweets.concat(JSON.parse(tweet_json));
        }
      });
    },
    methods: {
      join: function (e, _id) {
        e && e.preventDefault();

        var that = this;

        var name = this.$data.name;

        socket = io.connect();
        socket.on("connect", function () {
          if (! _id) {
            socket.emit("join", {
              name: name
            }, function (err, screen) {
              console.log(err, screen);

              that.$data.connected = true;
              var url = "/screen/" + screen._id;

              if (window.history) {
                history.pushState({}, screen._id, url);
              } else {
                location.assign(url);
              }
            });
          } else {
            socket.emit("join", {
              screen_id: _id
            }, function (err, screen) {
              console.log(err, screen);

              that.$data.connected = true;
              that.$data.name = screen.name;
              that.$data.channel = screen.channel.name;

              that.$emit("restore", screen.channel);
            });
          }
        }).on("error", function (err) {
          console.error(err);
        });

        socket.on("data", function (data) {
          console.log(data);
        });

        socket.on("tweet", function (tweet) {
          var tweets = that.$data.tweets;
          tweets.unshift(tweet);
          // 200 件を超えたら先頭 100 件を残して削除
          if (tweets.length >= 200) {
            tweets.splice(100, Infinity);
          }
          sessionStorage.setItem("channel", that.$data.channel);
          sessionStorage.setItem("tweets", JSON.stringify(tweets));
        });

        socket.on("update", function (screen) {
          console.log(screen);
          that.$data.name = screen.name;
          that.$data.channel = screen.channel.name;
        });

        socket.on("reload", function () {
          location.reload(true);
        });

        socket.on("notify", function (info) {
          console.log(info);
          if (info.sound && sounds[info.sound]) {
            sounds[info.sound].play();
          }
          if (info.message != null) {
            that.$data.message = info.message;
          }
        });
      }
    }
  });

  vm.$mount(document.body);

})(null);
