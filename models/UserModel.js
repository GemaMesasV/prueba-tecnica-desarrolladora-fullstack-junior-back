var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	password: {type: String, required: true},
	age: {type: Number, required:true},
	bankBalance: {type: Number, required:true, default: 0},
	accountNumber: {type: Number, required:true},
}, {timestamps: true});

// Virtual for user's full name
UserSchema
	.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

module.exports = mongoose.model("User", UserSchema);