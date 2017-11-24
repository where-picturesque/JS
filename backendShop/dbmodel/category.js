var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var obj={
	type:Array,
	shopid:String
}

var model = mongoose.model("category",new Schema(obj));
module.exports = model;