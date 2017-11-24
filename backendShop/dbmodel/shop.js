var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var obj={
	shopname:String,
	owner:String,
	shopimages:String,
	shoptype:String,
	address:String,
	time:Date
};


var model = mongoose.model("shop",new Schema(obj));
module.exports = model;