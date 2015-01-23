/**
 * Channels View Model
 *
 */
/* globals Vue */

Vue.component("channels", {
  template: "#channels-template",
  data: function () {
    return {
      channels: []
    };
  },
  created: function () {
    this.$on("update-channel", function (channels) {
      console.log(channels);
      this.$data.channels = channels;
    });
  },
  methods: {
    add: function () {
      this.$dispatch("create-channel");
    },
    remove: function (e, index) {
      var channel = this.$data.channels[index];
      this.$dispatch("remove-channel", channel);
    },
    notify: function (e, index) {
      var channel = this.$data.channels[index];
      this.$dispatch("notify", {
        channel: channel,
        sound: "notify"
      });
    },
    message: function (e, index) {
      var channel = this.$data.channels[index];
      this.$dispatch("create-message", false, channel);
    }
  }
});
