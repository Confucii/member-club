const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  membership_status: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

UserSchema.virtual("fullName").get(function () {
  return this.name.first + " " + this.name.last;
});

module.exports = mongoose.model("User", UserSchema);
