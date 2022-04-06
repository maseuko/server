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
    price: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("course", courseSchema);
