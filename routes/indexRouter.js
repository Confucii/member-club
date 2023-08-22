const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

/* GET home page. */
router.get("/", messageController.index);

router.get("/new-message", messageController.getNewMessage);

router.post("/new-message", messageController.postNewMessage);

router.post("/delete-message", messageController.postDeleteMessage);

module.exports = router;
