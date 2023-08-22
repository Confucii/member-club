const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/sign-up", userController.getSignUp);

router.post("/sign-up", userController.postSignUp);

router.get("/sign-in", userController.getSignIn);

router.post("/sign-in", userController.postSignIn);

router.get("/log-out", userController.signOut);

router.get("/join-club", userController.getJoinClub);

router.post("/join-club", userController.postJoinClub);

module.exports = router;
