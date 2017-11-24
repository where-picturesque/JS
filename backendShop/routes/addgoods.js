var express = require("express");
var router = express.Router();
var User = require("../dbmodel/user.js");
var Shop = require("../dbmodel/shop.js");
var Good = require("../dbmodel/goods.js");
var Category = require("../dbmodel/category.js");
var multer = require("multer");
var fs = require("fs")
var path = require("path");
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images') //文件路径
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage })


router.get("/", function(req, res) {
    var category="";
    if (req.session.userInfo) {
        var curshop = ""
        Shop.find({
            _id: req.query.id
        }).then(result => {
            curshop = result;
            
            return Category.find({ shopid: req.query.id })
        }).then(result => {
            try {
                category=result[0].type
            } catch(e) {
                // statements
                console.log(e);
            }
            res.render("addgoods", { isNew: true, title: "添加商品", add: false, isshow: true, curshop: curshop[0], hasshop: true, user: req.cookies["currentUser"], category: category });

        })
    } else {
        res.redirect("/login")
    }


});


router.post("/", upload.array("photo", 10), function(req, res) {
    if (req.session.userInfo) {
        console.log(req.files)
        var filename = [];
        for (var i = 0; i < req.files.length; i++) {
            filename.push(req.files[i].filename);
        }
        Good.create({
            shopid: req.body.shopid,
            title: req.body.title,
            price: req.body.price,
            num: req.body.num,
            type: req.body.type,
            description: req.body.description,
            size: req.body.size,
            sex:req.body.sex,
            filename: JSON.stringify(filename),
            time:Date.now()
        });
        Shop.find({
            _id: req.body.shopid
        }).then(result => {
            res.redirect("/shop?shopid=" + req.body.shopid)
            // res.render("addgoods", { isNew: true, title: "添加商品", add:false,isshow: true, curshop: result[0], shopnames:result[0] , user: req.cookies["currentUser"] });
        })
    } else {
        res.redirect("/login")
    }
});
//更新商品
router.get("/update", function(req, res) {
    var shop = "";
    var category = ""
    Shop.find({ _id: req.query.shopid }).then(shopresult => {
        shop = shopresult;
        return Category.find({ shopid: req.query.shopid })
    }).then(result => {
        try {
            category = result[0].type;
        } catch(e) {
            // statements
            console.log(e);
        }
        
        return Good.find({ _id: req.query.goodid })
    }).then(goodresult => {
        // console.log(shopresult)
        res.render("addgoods", { isNew: false, title: "更新商品", add: false, isshow: false, user: req.cookies["currentUser"], hasshop: true, curshop: shop[0], goodresult: goodresult[0], category: category })
    })

});



router.post("/update", upload.array("photo", 10), function(req, res) {
    if (req.session.userInfo) {
        // console.log(req.files)
        var filename = [];
        for (var i = 0; i < req.files.length; i++) {
            filename.push(req.files[i].filename);
        }
        // console.log(req.body.price)
        Good.find({ _id: req.body.goodid }).then(deloldimages => {
            var oldfiles = JSON.parse(deloldimages[0].filename);

            oldfiles.forEach(function(element, index) {

                fs.unlinkSync(path.join(__dirname, "../public/images/", element))
                console.log("已删除一个")
            });
            return Good.findByIdAndUpdate(req.body.goodid, {
                $set: {
                    title: req.body.title,
                    price: req.body.price,
                    num: req.body.num,
                    type: req.body.type,
                    description: req.body.description,
                    size: req.body.size,
                    sex:req.body.sex,
                    filename: JSON.stringify(filename),
                    time:Date.now()
                }
            })
        }).then(result => {
            Good.find({ _id: req.body.goodid }).then(goodresult => {
                // console.log(goodresult)
                return Shop.find({ _id: goodresult[0].shopid })
            }).then(shopresult => {
                res.redirect("/shop?shopid=" + shopresult[0]._id)
            })
        })


    } else {
        res.redirect("/login")
    }
});


//新建分类
router.get("/category", function(req, res) {
    if (req.session.userInfo) {
        Shop.find({ _id: req.query.shopid }).then(result => {
            res.render("category", { title: "新建分类", user: req.cookies["currentUser"], curshop: result[0], showerror: false })
        })

    } else {
        res.redirect("/login");
    }
});


router.post("/category", function(req, res) {
    var curshop = "";
    Shop.find({ _id: req.body.shopid }).then(result => {
        curshop = result[0];
        return Category.find({ shopid: req.body.shopid })
    }).then(result => {
        if (result.length == 0) {
            Category.create({
                type: [req.body.type],
                shopid: req.body.shopid
            }).then(result => {
                res.redirect("/shop?shopid=" + req.body.shopid)
            })
        } else {
            var index = result[0].type.indexOf(req.body.type);
            console.log(index) //是否存在-1不存在
            if (index == -1) { //不存在   新分类
                Category.update({ shopid: req.body.shopid }, { $push: { type: req.body.type } }).then(result => {
                        console.log(result)
                    res.redirect("/shop?shopid=" + req.body.shopid)
                })
            } else {
                res.render("category", { title: "新建分类", user: req.cookies["currentUser"], curshop: curshop, showerror: true })
            }
        }

    })
})



module.exports = router;