var mongoose   = require('mongoose');

var creditSchema= new mongoose.Schema(
{	userId: String,
	requestedBy: String,
	requestedAt: Date,
	amount: Number,
	repaymentDate: Date,
	isRepaymentDone: Boolean 
});

module.exports =mongoose.model('credit',creditSchema);
