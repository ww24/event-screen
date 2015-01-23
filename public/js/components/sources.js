/**
* Sources View Model
*
*/
/* globals Vue */

Vue.component("sources", {
  template: "#sources-template",
  data: function () {
    return {
      sources: []
    };
  },
  created: function () {
    this.$on("update-source", function (sources) {
      console.log(sources);
      this.$data.sources = sources;
    });
  },
  methods: {
    add: function () {
      this.$dispatch("create-source");
    },
    remove: function (e, index) {
      var source = this.$data.sources[index];
      this.$dispatch("remove-source", source);
    },
    edit: function (e, index) {
      var source = this.$data.sources[index];
      // edit
    },
    stopEvent: function (e) {
      e.stopPropagation();
    },
    cancelEvent: function (e) {
      e.preventDefault();
    }
  }
});
