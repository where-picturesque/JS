var express = require('express');
var router = express.Router();
var User = require("../dbmodel/user.js");
var Shop = require("../dbmodel/shop.js");
var Good = require("../dbmodel/goods.js");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.userInfo) {
        var goodnum = [];
        User.find({ username: req.cookies["currentUser"] }).then(result => {
            // console.log(result);
            Shop.find({ owner: req.cookies["currentUser"] }).then(shopresult => {
                if (shopresult.length == 0) {
                    res.render('index', { title: '店铺商品后台管理系统', user: result[0].username, hasshop: false, curshop: shopresult[0], shopnames: shopresult });
                } else {

                    var promises = shopresult.map(res => Good.count({ shopid: res._id }))
                    
                    Promise.all(promises).then(result => {
                        console.log(result)
                        res.render('index', { title: '店铺商品后台管理系统', user: result[0].username, hasshop: false, curshop: shopresult[0], shopnames: shopresult, goodnum: result });
                    })
                    
                }

            })

        })
    } else {
        res.redirect("/login")
    }

});

//注销
router.get("/logout", function(req, res) {
    req.session.destroy(result => {
        res.redirect("/login");
    })
});




module.exports = router;