var express = require("express");
const RequestController = require("../controllers/RequestController");

var router = express.Router();

router.post("/", RequestController.requestCreate);
router.post("/accept", RequestController.requestAccept);
router.post("/reject", RequestController.requestReject);

module.exports = router;