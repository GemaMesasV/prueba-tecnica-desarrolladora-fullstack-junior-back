var express = require("express");
const ConnectionsController = require("../controllers/ConnectionsController");

var router = express.Router();

//router.post("/", ConnectionsController.requestCreate);
router.get("/", ConnectionsController.connectionsList);
router.delete("/:id", ConnectionsController.deleteConnection);

module.exports = router;