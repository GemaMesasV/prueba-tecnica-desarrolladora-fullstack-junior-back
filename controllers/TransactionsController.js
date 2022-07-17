const User = require("../models/UserModel");
const Transaction = require("../models/TransactionModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

function TransactionData(data) {
	this.id = data._id;
	this.from = data.from;
	this.to = data.to;
	this.amount = data.amount;
	this.createdAt = data.createdAt;
}

const objectIdisInArray = (id, array) => array.some(objectId => {
	return objectId == id;
});

exports.transactionCreate = [
	auth,
	body("to", "To must not be empty").not().isEmpty().trim().custom((value, {req}) => {
		return User.findOne({ accountNumber: value }).then((user) => {
			if (!user) {
				return Promise.reject("Account number not found");
			}
			else if(!objectIdisInArray(user._id, req.user.connections) ||  !objectIdisInArray(req.user._id, user.connections)) return Promise.reject("Users are not in each others connections lists");
		});
	}),
	body("amount", "Amount must not be empty").not().isEmpty().trim().custom((value, { req }) => {
		if (req.user.bankBalance < Number(value)) throw new Error("Ammount transfer exceeds your balance");
		return true;
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				return User.findOne({ accountNumber: req.body.to }).then((user) => {
					if (!user) {
						return Promise.reject("Account number not found");
					}
					User.findByIdAndUpdate(req.user, { $inc: { bankBalance: -req.body.amount }}, function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
					});
					User.findByIdAndUpdate(user, { $inc: { bankBalance: req.body.amount }}, function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
					});
					var transaction = new Transaction(
						{
							from: req.user,
							to: user,
							amount: req.body.amount
						});
					//Save request.
					transaction.save(function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
						let transactionData = new TransactionData(transaction);
						return apiResponse.successResponseWithData(res, "Request add Success.", transactionData);
					});
				});

			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];