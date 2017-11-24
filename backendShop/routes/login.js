var express = require("express");
var router = express.Router();
var User = require("../dbmodel/user.js");
var md5 =require("md5")

router.get("/",function (req,res) {
	res.render("login",{title:"登录页面",logerror:false})
});

router.post("/",function(req,res){
	User.find({
		username:req.body.username,
		password:md5(req.body.password)
	}).then(result=>{
		if (result.length==0) {
			res.render("login",{title:"登录页面",logerror:true})
		} else {//用户名密码正确
			req.session.userInfo=result[0];
			res.cookie("currentUser",req.body.username);
			res.redirect("/");
		}
	})
	
})
module.exports=router;