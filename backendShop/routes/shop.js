var express = require('express');
var router = express.Router();
var User = require("../dbmodel/user.js");
var Shop = require("../dbmodel/shop.js");
var Good = require("../dbmodel/goods.js");
var Category = require("../dbmodel/category.js");
var multer = require("multer");
var fs = require("fs");
var path = require("path");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/shop') //文件路径
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage })

/* GET home page. */

router.get("/", function(req, res) {
    // console.log(req.query)
    var myshops = "";
    var curshop = "";
    var onsalecount="";
    var category="";
    Shop.find({ owner: req.cookies["currentUser"] }).then(shops => {
        myshops = shops;
        // console.log(shops)
        return Shop.find({ _id: req.query.shopid })
    }).then(shopresult => {
        console.log(myshops)
        curshop = shopresult;
        return Good.count({ shopid: req.query.shopid,status:true })
    }).then(onsale=>{
        onsalecount=onsale;
        return Category.find({shopid:curshop[0]._id})
    }).then(result=>{
        try {
            category=result[0].type
        } catch(e) {
            // statements
            console.log(e);
        }
        
        return Good.find({ shopid: req.query.shopid })

    }).then(goodresult => {
        if (curshop.length == 0) {
            res.render('shop', { title: '店铺商品后台管理系统', user: req.cookies["currentUser"], hasshop: false, curshop: curshop[0], shopnames: myshops, goodresult: goodresult });
        } else {
            res.render('shop', { title: '店铺商品后台管理系统', user: req.cookies["currentUser"], hasshop: true, curshop: curshop[0], shopnames: myshops, goodresult: goodresult,onsalecount:onsalecount ,totalcount:goodresult.length,category:category});
        }

    })


});
//店铺
router.get("/register", function(req, res) {
    if (req.session.userInfo) {
        res.render("shop-register", { title: "店铺注册", add: false, user: req.cookies["currentUser"], hasshop:false,regerror: false, isNew: true })
    } else {
        res.redirect("/login");
    }
})
//注册店铺
router.post("/register", upload.single("shopphoto"), function(req, res) {
    Shop.find({ shopname: req.body.shopname }).then(result => {
        if (result.length == 0) {
            console.log(req.file)
            Shop.create({
                shopname: req.body.shopname,
                shoptype: req.body.shoptype,
                address:req.body.address,
                shopimages: req.file.filename,
                owner: req.cookies["currentUser"],
                time: new Date()
            });
            res.redirect("/")
        } else { //已有同名店铺
            res.render("shop-register", { title: "注册店铺", user: req.cookies["currentUser"], add: false, regerror: true, isNew: true })
        }
    })
})

//修改店铺信息
router.get("/update", function(req, res) {
    Shop.find({ _id: req.query.shopid }).then(result => {
        res.render("shop-register", { title: "店铺注册", user: req.cookies["currentUser"], regerror: false,hasshop:true,curshop:result[0], isNew: false, shopinfo: result[0] })
    })
});
//修改店铺信息处理
router.post("/update", upload.single("shopphoto"), function(req, res) {
    console.log(req.body.shopid);
    var filename = ""
    try {
        filename = req.file.filename
    } catch (e) {

    }
    Shop.find({ _id: req.body.shopid }).then(deloldimages => {
        fs.unlinkSync(path.join(__dirname, "../public/images/shop/", deloldimages[0].shopimages));
        return Shop.findByIdAndUpdate(req.body.shopid, { $set: { shopname: req.body.shopname, shoptype: req.body.shoptype,address:req.body.address, shopimages: filename } })
    }).then(result => {
        // console.log(result)
        res.redirect("/")
    })
})


//删除店铺
router.get("/delete", function(req, res) {
    Shop.find({ _id: req.query.shopid }).then(delshopimages => {
        console.log(delshopimages[0].shopimages)
        fs.unlinkSync(path.join(__dirname, "../public/images/shop/", delshopimages[0].shopimages)); //删除商标图片
        return Shop.findByIdAndRemove(req.query.shopid) //删除店铺
    }).then(result => {
        return Good.find({ shopid: req.query.shopid })
    }).then(goodresult => {
        //删除店铺商品的图片
        for (var i = 0; i < goodresult.length; i++) {

            var files = JSON.parse(goodresult[i].filename);
            console.log(i,files)
            for (var j = 0; j < files.length; j++) {
                console.log(j)
                fs.unlinkSync(path.join(__dirname, "../public/images/", files[j]))
            }
        }
        // 删除店铺内的商品
        Good.remove({ shopid: req.query.shopid })
        res.redirect("/");
    })

})




//删除商品
router.get("/del", function(req, res) {
    // console.log(req.query)
    Good.find({ _id: req.query.goodid }).then(search => {
        var files = JSON.parse(search[0].filename);
        console.log(files)

        for (var i = 0; i < files.length; i++) {
            console.log(files[i])
            fs.unlinkSync(path.join(__dirname, "../public/images/", files[i]))
        }

        Good.findByIdAndRemove(req.query.goodid).then(result => {
            console.log("删除")
            res.redirect(`/shop?shopid=${req.query.shopid}`)
        })
    })

})
//商品详情页
router.get("/detail", function(req, res) {
    var shopresult = "";
    Shop.find({ _id: req.query.shopid }).then(shopresult => {
        shop = shopresult;
        return Good.find({ _id: req.query.goodid })

    }).then(goodresult => {
        // console.log(shopresult)
        res.render("detail", { title: "商品详情页", user: req.cookies["currentUser"],hasshop:true, curshop: shop[0], shopnames: shop[0], goodresult: goodresult[0] })
    })

});


//商品上架
router.get("/onsale",function (req,res) {
    Good.findByIdAndUpdate(req.query.goodid,{$set:{status:true}}).then(result=>{
        res.redirect("/shop?shopid="+req.query.shopid)
    })
});

//商品下架
router.get("/offsale",function (req,res) {
    Good.findByIdAndUpdate(req.query.goodid,{$set:{status:false}}).then(result=>{
        res.redirect("/shop?shopid="+req.query.shopid)
    })
});

//上架商品页面
router.get("/showsale",function (req,res) {
    // console.log(req.query)
    var curshop="";
    var allgood="";
    var category="";
    Shop.find({_id:req.query.shopid}).then(curShop=>{
        curshop=curShop;
        return Category.find({shopid:req.query.shopid})
    }).then(result=>{
        try {
           category=result[0].type;
        } catch(e) {
            // statements
            console.log(e);
        }        
        return Good.find({shopid:req.query.shopid})
    }).then(allgoodresult=>{
        allgood=allgoodresult;
        if (req.query.on==1) {//上架
            return Good.find({shopid:req.query.shopid,status:true})
        } else {
            return Good.find({shopid:req.query.shopid,$or:[{status:false},{status:""},{status:null}]})
        }
        
    
    }).then(goodresult=>{
        if (req.query.on==1) {//上架
            res.render("shop",{title:"上架商品",goodresult:goodresult,curshop:curshop[0],user:req.cookies["currentUser"],shopnames:curshop,hasshop:true,on:1,onsalecount:goodresult.length,totalcount:allgood.length,category:category})
        } else {
            res.render("shop",{title:"上架商品",goodresult:goodresult,curshop:curshop[0],user:req.cookies["currentUser"],shopnames:curshop,hasshop:true,on:0,onsalecount:allgood.length-goodresult.length,totalcount:allgood.length,category:category})
        }
        
    })
});

//选择类别

router.get("/category",function (req,res) {
    var curshop="";
    var category="";
    var goodresult="";
    var shopnames="";
    Shop.find({ owner: req.cookies["currentUser"] }).then(myshops=>{
        shopnames=myshops;
        return Category.find({shopid:req.query.shopid})
    }).then(result=>{
        category=result[0].type
        return Shop.find({_id:req.query.shopid})
    }).then(Curshop=>{
        curshop=Curshop; 
        // console.log(curshop)
        return Good.find({shopid:req.query.shopid,type:req.query.type})
    }).then(result=>{
        console.log(req.query)
        goodresult=result;
        return Good.find({shopid:req.query.shopid,type:req.query.type,status:true})
    }).then(sale=>{
        res.render("shop",{title:"分类",user:req.cookies["currentUser"],curshop:curshop[0],shopnames:shopnames,hasshop:true,goodresult:goodresult,onsalecount:sale.length,totalcount:goodresult.length,category:category})
            
    })
})



module.exports = router;