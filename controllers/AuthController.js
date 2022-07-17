const UserModel = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
	// Validate fields.
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
		.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	body("age").isInt({ min: 18 }).withMessage("Age must be 18 or older"),
	body("bankBalance").isInt().withMessage("Bank balance must be a number"),
	// Sanitize fields.
	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("password").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				UserModel.findOne({ firstName: req.body.firstName, lastName: req.body.lastName }).then(user => {
					if (user) {
						return apiResponse.unauthorizedResponse(res, "Name and last name already in use");
					}
					else {
						//hash input password
						bcrypt.hash(req.body.password, 10, function (err, hash) {
							let accountNumber = utility.randomNumber(10);
							// Create User object with escaped and trimmed data
							var user = new UserModel(
								{
									firstName: req.body.firstName,
									lastName: req.body.lastName,
									password: hash,
									age: req.body.age,
									bankBalance: req.body.bankBalance,
									accountNumber
								}
							);
							user.save(function (err) {
								if (err) { return apiResponse.ErrorResponse(res, err); }
								let userData = {
									_id: user._id,
									firstName: user.firstName,
									lastName: user.lastName,
									email: user.email
								};
								return apiResponse.successResponseWithData(res, "Registration Success.", userData);
							});
						});
					}
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified."),
	body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("password").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				UserModel.findOne({ firstName: req.body.firstName, lastName: req.body.lastName }).then(user => {
					if (user) {
						//Compare given password with db's hash.
						bcrypt.compare(req.body.password, user.password, function (err, same) {
							if (same) {
								let userData = {
									_id: user._id,
									firstName: user.firstName,
									lastName: user.lastName,
									accountNumber: user.accountNumber,
									connections: user.connections,
									bankBalance: user.bankBalance
								};
								//Prepare JWT token for authentication
								const jwtPayload = userData;
								const jwtData = {
									expiresIn: process.env.JWT_TIMEOUT_DURATION,
								};
								const secret = process.env.JWT_SECRET;
								//Generated JWT token with Payload and secret.
								userData.token = jwt.sign(jwtPayload, secret, jwtData);
								return apiResponse.successResponseWithData(res, "Login Success.", userData);
							} else {
								return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
							}
						});
					} else {
						return apiResponse.unauthorizedResponse(res, "Name or Password wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];