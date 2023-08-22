const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, set: (val) => (val === "" ? "Untitled" : val) },
  timestamp: { type: Date, default: Date.now },
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("time").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED_WITH_SECONDS
  );
});

module.exports = mongoose.model("Message", MessageSchema);
