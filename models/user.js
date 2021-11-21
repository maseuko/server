const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAuthorized: {
      type: Boolean,
      required: true,
    },
    authorizedToken: {
      type: String,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    permissions: [
      {
        courseId: {
          type: String,
          required: true,
        },
        modify: Boolean,
      },
    ],
    headAdmin: Boolean,
  },
  { timestamps: true }
);

module.exports = mongodb.model("User", userSchema);
