var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var obj={
	shopid:String,
	title:String,
	price:Number,
	num:String,
	type:String,
	description:String,
	size:String,
	sex:String,
	filename:String,
	status:Boolean,
	time:Date
};


var model = mongoose.model("good",new Schema(obj));
module.exports = model;