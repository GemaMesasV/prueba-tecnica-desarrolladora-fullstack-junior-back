var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
	from: {type: Schema.ObjectId, required: true},
	to: {type: Schema.ObjectId, required: true},
	amount: {type: Number, required: true},
}, {timestamps: true});

module.exports = mongoose.model("Transaction", TransactionSchema);