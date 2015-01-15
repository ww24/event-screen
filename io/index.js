/**
 * io route
 *
 */

module.exports = function () {
  var io = this;

  io.on("connection", function (socket) {
    console.log(socket.id);

    socket.on("disconnect", function () {
      console.log(socket.id);
    });
  });
};
