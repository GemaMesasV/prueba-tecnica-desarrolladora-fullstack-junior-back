var express = require("express");
var authRouter = require("./auth");
var requestRouter = require("./request");
var connectionsRouter = require("./connections");
var transactionsRouter = require("./transactions");

var app = express();

app.use("/auth/", authRouter);
app.use("/request/", requestRouter);
app.use("/connections/", connectionsRouter);
app.use("/transactions/", transactionsRouter);

module.exports = app;