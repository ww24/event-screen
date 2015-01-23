/**
 * Create Message View Model
 *
 */
/* globals Vue */

Vue.component("create-message-modal", {
  template: "#create-message-template",
  data: function () {
    return {
      channel: {}
    };
  },
  created: function () {
    this.$on("create-message", function (close, channel) {
      this.$data.channel = channel;
      $(this.$el).modal(["show", "hide"][+!! close]);
    });
  },
  methods: {
    create: function (e) {
      e.preventDefault();

      var data = {
        channel: this.$data.channel,
        sound: "notify"
      };

      var params = $(e.target).serializeArray();
      params.forEach(function (param) {
        data[param.name] = param.value;
      });

      this.$dispatch("create-message", data);
    }
  }
});
