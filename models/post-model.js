const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: new Date().toString(),
  },
  author: String,
});
module.exports = mongoose.model("Post", postSchema);
