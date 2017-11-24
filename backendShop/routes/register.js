var express = require("express");
var router= express.Router();
var User = require("../dbmodel/user.js");
var Shop = require("../dbmodel/shop.js");
var md5 = require("md5");


router.get("/",function (req,res) {
	res.render("register",{title:"注册",isshow:true,regerror:false});
});

router.post("/",function (req,res) {
		User.find({username:req.body.username}).then(result=>{
			if (result.length==0) {//新用户
				User.create({
					username:req.body.username,
					email:req.body.email,
					password:md5(req.body.password)
				})
				res.redirect("/login");
			} else {//已注册
				res.render("register",{title:"注册页面",isshow:false,add:false,regerror:true})
			}
		})
})


module.exports=router;