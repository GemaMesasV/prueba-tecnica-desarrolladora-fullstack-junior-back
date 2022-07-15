var express = require("express");
var authRouter = require("./auth");
var requestRouter = require("./request");

var app = express();

app.use("/auth/", authRouter);
app.use("/request/", requestRouter);

module.exports = app;