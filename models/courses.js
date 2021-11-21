const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    school: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("course", courseSchema);
