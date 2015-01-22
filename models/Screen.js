/**
 * Screen Model
 *
 */

var mongoose = require("mongoose");

// Screen Schema definition
var schema = new mongoose.Schema({
  socket_id: {
    type: String,
    index: {unique: true}
  },
  status: {
    type: String,
    enum: ["offline", "online"],
    default: "online",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel"
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// 保存時の処理
schema.pre("save", function (next) {
  this.updated_at = Date.now();

  next();
});

module.exports = mongoose.model("Screen", schema);
