const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.getSignUp = asyncHandler(async (req, res) => {
  res.render("sign_up");
});

exports.postSignUp = [
  body("firstName", "First name should consist of at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("lastName", "Last name should consist of at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("username")
    .trim()
    .custom(async (val) => {
      const user = await User.findOne({ username: val }).exec();
      if (user) {
        throw new Error("Username is already taken");
      }
    })
    .isLength({ min: 8 })
    .withMessage("Username should be at least 8 characters long")
    .escape(),
  body("password", "Password should be at least 8 symbols long")
    .isLength({
      min: 8,
    })
    .escape(),
  body("confirm-password", "Passwords do not match").custom((val, { req }) => {
    return val === req.body.password;
  }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      name: { first: req.body.firstName, last: req.body.lastName },
      username: req.body.username,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render("sign_up", { user: user, errors: errors.array() });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        user.password = hashedPassword;
        await user.save();
      });
      res.redirect("./sign-in");
    }
  }),
];

exports.getSignIn = asyncHandler((req, res) => {
  res.render("log_in", { errors: req.session.messages });
});

exports.postSignIn = [
  body("username").escape(),
  body("password").escape(),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "./sign-in",
    failureMessage: true,
  }),
];

exports.signOut = asyncHandler((req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
