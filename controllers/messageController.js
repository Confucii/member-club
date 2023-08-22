const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res) => {
  const allMessages = await Message.find()
    .populate("user")
    .sort({ timestamp: -1 })
    .exec();
  res.render("index", { messages: allMessages });
});

exports.getNewMessage = asyncHandler((req, res) => {
  res.render("message_form");
});

exports.postNewMessage = [
  body("title").trim().escape(),
  body("text", "Text should be at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!req.user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      user: req.user._id,
    });

    if (!errors.isEmpty()) {
      res.render("message_form", { message: message, errors: errors.array() });
      return;
    } else {
      await message.save();
      res.redirect("/");
    }
  }),
];

exports.postDeleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.body.messageid);

  if (!message) {
    res.redirect("/");
  }

  await Message.findByIdAndRemove(req.body.messageid);
  res.redirect("/");
});
