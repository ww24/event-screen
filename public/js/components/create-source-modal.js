/**
 * Create Source View Model
 *
 */
/* globals Vue */

Vue.component("create-source-modal", {
  template: "#create-source-template",
  data: function () {
    return {
    };
  },
  created: function () {
    this.$on("create-source", function (close) {
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

      this.$dispatch("create-source", data);
    }
  }
});
