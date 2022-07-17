const Request = require("../models/RequestModel");
const User = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

exports.connectionsList = [
	auth,
	function (req, res) {
		try {
			User.find({ _id : { $in : req.user.connections } },"firstName lastName age accountNumber").then((users)=>{
				if(users.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", users);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.deleteConnection = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			User.findByIdAndUpdate(req.user, { $pull: { connections: req.params.id } } , function (err) {
        if (err) { return apiResponse.ErrorResponse(res, err); }
        else return apiResponse.successResponseWithData(res, "Connection deleted.");
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];