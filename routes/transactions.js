var express = require("express");
const TransactionsController = require("../controllers/TransactionsController");

var router = express.Router();

router.post("/", TransactionsController.transactionCreate);

module.exports = router;