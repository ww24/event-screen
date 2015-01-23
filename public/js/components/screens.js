/**
* Screens View Model
*
*/
/* globals Vue */

Vue.component("screens", {
  template: "#screens-template",
  data: function () {
    return {
      screens: []
    };
  },
  created: function () {
    this.$on("update-screen", function (screens) {
      console.log(screens);
      this.$data.screens = screens;
      this.$data.screens = screens.map(function (screen) {
        screen.channel = screen.channel || {};
        return screen;
      });
    });
  },
  methods: {
    reload: function (e, index) {
      var screen = this.$data.screens[index];
      this.$dispatch("reload", screen);
    },
    remove: function (e, index) {
      var screen = this.$data.screens[index];
      this.$dispatch("remove-screen", screen);
    },
    updateScreen: function (e, index) {
      var screen = this.$data.screens[index];
      console.log(screen.name, screen.channel.name);
      this.$dispatch("update-screen", screen);
    }
  }
});
