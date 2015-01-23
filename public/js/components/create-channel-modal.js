/**
 * Create Channel View Model
 *
 */
/* globals Vue */

Vue.component("create-channel-modal", {
  template: "#create-channel-template",
  data: function () {
    return {
    };
  },
  created: function () {
    this.$on("create-channel", function (close) {
      $(this.$el).modal(["show", "hide"][+!! close]);
    });
  },
  methods: {
    create: function (e) {
      e.preventDefault();

      var data = {};

      var params = $(e.target).serializeArray();
      params.forEach(function (param) {
        data[param.name] = param.value;
      });

      data.source = data.source || null;

      this.$dispatch("create-channel", data);
    }
  }
});
