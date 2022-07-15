const Request = require("../models/RequestModel");
const User = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Book Schema
function RequestData(data) {
	this.id = data._id;
	this.from = data.from;
	this.to = data.to;
	this.status = data.status;
	this.createdAt = data.createdAt;
}

exports.requestCreate = [
	auth,
	body("to", "To must not be empty").isLength({ min: 1 }).trim().custom((value) => {
		return User.findOne({ accountNumber: value }).then((user) => {
			if (!user) {
				return Promise.reject("Account number not found");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				User.findOne({ accountNumber: req.body.to }).then(user => {
					if (user) {
						var request = new Request(
							{
								from: req.user,
								to: user,
							});
						//Save request.
						request.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							let requestData = new RequestData(request);
							return apiResponse.successResponseWithData(res, "Request add Success.", requestData);
						});
					}
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.requestAccept = [
	auth,
	body("requestId", "requestId must not be empty").isLength({ min: 1 }).trim().custom((value, { req }) => {
		return Request.findOne({ _id: value, to: req.user, status: "Pending" }).then((request) => {
			if (!request) {
				return Promise.reject("Request not found");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			Request.findOne({ _id: req.body.requestId, to: req.user }).then((request) => {
				if (request) {
					User.findByIdAndUpdate(req.user, { $push: { connections: [request.from] } }, function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
					});
					User.findByIdAndUpdate(request.from, { $push: { connections: [req.user] } }, function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
					});
					Request.updateOne(request, { status: "Accepted" }, function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
						return apiResponse.successResponseWithData(res, "Request accepted.");
					});
				}
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.requestReject = [
	auth,
	body("requestId", "requestId must not be empty").isLength({ min: 1 }).trim().custom((value, { req }) => {
		return Request.findOne({ _id: value, to: req.user, status: "Pending" }).then((request) => {
			if (!request) {
				return Promise.reject("Request not found");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			Request.findByIdAndUpdate({ _id: req.body.requestId, to: req.user }, { status: "Rejected" }, function (err) {
				if (err) { return apiResponse.ErrorResponse(res, err); }
				return apiResponse.successResponseWithData(res, "Request rejected.");
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];