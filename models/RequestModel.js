var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RequestSchema = new Schema({
	from: {type: Schema.ObjectId, required: true},
	to: {type: Schema.ObjectId, required: true},
	status: {type: String, required: true, default: "Pending"},
}, {timestamps: true});

module.exports = mongoose.model("Request", RequestSchema);