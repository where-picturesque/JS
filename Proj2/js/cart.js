define(['jquery', 'cookie','login','register'], function() { //引入插件
	return {
		//推荐商品
		recommend: (function() {
			$.ajax({
				type: "get",
				url: "php/brandgood.php",
				async: false,
				dataType: "json"
			}).done(function(data) {
				var detail = data.detail;
				//console.log(detail)
				detail.splice(0,12)
				for(var $i = 0; $i < 12; $i++) {
					var $clone = $(".recommend-list-item-hidden").clone(true);
					$clone.removeClass("recommend-list-item-hidden").appendTo(".recommend-list");
					$clone.find("a").attr("href", "detail.html?id=" + detail[$i].id);
					$clone.find("img").attr({
						"src": detail[$i].url,
						"sid": detail[$i].id
					});
					$clone.find(".recommend-title").html(detail[$i].title);
					$clone.find(".recommend-price").html(detail[$i].price);
				}
			})
		})(),
		//购物车是否为空
		emptyornot: (function() {
			if(getCookie("cartList")) { //购物车有商品
				$(".cart-empty").hide();
			} else {
				$(".cart-empty").show();
			}

		})(),
		//加入购物车
		addpro: (function() {
			kong();
			var arrsid = [];
			var arrnum = [];
			cookieToArray();
			//页面加载时当有cookie 则创建购物车列表
			for(var i = 0; i < arrsid.length; i++) {
				creategoods(arrsid[i], arrnum[i]);
			}
			totalPrice();
			$(".recommend-btn").click(function() {

				cookieToArray() //获取cookie

				var sid = $(this).parents(".recommend-list-item").find(".recommend-id").attr("sid");
				//商品是否已添加过
				if($.inArray(sid, arrsid) != -1) { //已有该商品
					$('.product-item:visible').each(function() {
						if(sid == $(this).find('.product-smallimg').attr('sid')) {
							console.log(this)
							var num = $(this).find('.num-input').html();
							num++;
							$(this).find('.num-input').html(num);
							var singleprice = $(this).find('.price-now').html();

							var reg = /\d/;
							var exp = reg.exec(singleprice).index;
							var singleprice = singleprice.substring(exp)

							$(this).find('.subtotal-item').html("￥"+(num * singleprice).toFixed(2));
							arrnum[$.inArray(sid, arrsid)] = num;
							addCookie('cartnum', arrnum.toString(), 7); //仅需要存放数量

						}
					})

				} else { //新商品
					arrsid.push(sid); //存放商品编号的数组
					addCookie('cartsid', arrsid.toString(), 7);
					arrnum.push(1);
					addCookie('cartnum', arrnum.toString(), 7);
					creategoods(sid, 1);
				}
				kong();
				totalPrice();
			})

			//渲染购物车商品列表
			function creategoods(sid, num) {
				//				console.log("create");
				$.ajax({
					type: "get",
					url: "php/brandgood.php",
					async: false,
					dataType: "json"
				}).done(function(data) {
					var detail = data.detail;
					for(var i = 0; i < 100; i++) {
						if(detail[i].id == sid) { //接口数据下面的sid和点击按钮对应的sid进行比较，确认内容。
							var $clone = $(".product-item-hidden").clone(true);
							$clone.removeClass("product-item-hidden");
							$clone.find(".product-smallimg").attr({
								src: detail[i].url,
								sid: detail[i].id
							})
							$clone.find(".product-name").html(detail[i].title);
							$clone.find(".product-link").attr("href", "detail.html?id=" + detail[i].id);
							$clone.find(".price-now").html(detail[i].price);
							$clone.find(".price-before").html(detail[i].originprice);
							$clone.find(".num-input").html(num);
							console.log(num)
							if(num == 1) {
								console.log(1)
								$(".num-reduce").addClass("num-reduce-disabled");
							}else{
								$(".num-reduce").removeClass("num-reduce-disabled");
							}
							var singleprice = detail[i].price;
							var reg = /\d/;
							var exp = reg.exec(singleprice).index;
							var singleprice = singleprice.substring(exp)
							$clone.find(".subtotal-item").html("￥" + (num * singleprice).toFixed(2));

							$clone.appendTo(".product-table");
							//							console.log("find")
						}
					}
				})

			}
			//数量加减
			$(".num-btn").click(function() {
				var goodNum = $(this).siblings(".num-input").html();
				if($(this).hasClass("num-reduce")) { //减
					if(goodNum != 1) {
						goodNum--;
					} else { //数量为1
						$(this).addClass("num-reduce-disabled");
					}
				} else { //加
					goodNum++;
				}
				$(this).siblings(".num-input").html(goodNum);
				if(goodNum == 1) {
					$(this).parents(".product-item").find(".num-reduce").addClass("num-reduce-disabled");
				} else {
					$(this).parents(".product-item").find(".num-reduce").removeClass("num-reduce-disabled");
				}
				console.log($(this).parents(".product-item").find(".num-reduce"))
				chnumsubtotal(this, goodNum);

			})

			//删除一行
			$(".actions-item").click(function() {
				var sid = $(this).parent(".product-item").find(".product-smallimg").attr("sid");
				deletegood(this, sid);
			})
			//删除一行商品
			function deletegood(obj, sid) {
				var index = $.inArray(sid, arrsid);
				arrsid.splice(index, 1);
				arrnum.splice(index, 1);
				console.log(arrsid, arrnum);
				$(obj).parent(".product-item").remove();

				//				totalPrice();
				if(arrsid.length == 0) {
					delCookie("cartsid", arrsid);
					delCookie("cartnum", arrnum);
				}
				addCookie("cartsid", arrsid);
				addCookie("cartnum", arrnum);
				kong();
				totalPrice();
			}
			//当商品数量变化时 cookie和小计变化
			function chnumsubtotal(obj, num) {
				var sid = $(obj).parents(".product-item").find(".product-smallimg").attr("sid");
				arrnum[$.inArray(sid, arrsid)] = num;
				var singleprice = $(obj).parents(".product-item").find('.price-now').html();

				var reg = /\d/;
				var exp = reg.exec(singleprice).index;
				var singleprice = singleprice.substring(exp)
				$(obj).parents(".product-item").find('.subtotal-item').html("￥" + (num * singleprice).toFixed(2));
				addCookie('cartnum', arrnum.toString(), 7);
				totalPrice();
			}

			function totalPrice() {
				var totalPrice = 0;
				//				console.log("totalPrice")
				$('.product-item:visible').each(function() {
					var subtotal = $(this).find(".subtotal-item").html();
					var reg = /\d/;
					var exp = reg.exec(subtotal).index;
					var subtotal = subtotal.substring(exp);
					//					console.log(subtotal)
					totalPrice += parseInt(subtotal);
					//					console.log(totalPrice)
				})
				$(".total-price-num").html(totalPrice.toFixed(2));
			}

			//获取cookie 并如果不存在 创建一个空数组用于存放			

			function cookieToArray() {
				if(getCookie('cartsid')) {
					arrsid = getCookie('cartsid').split(',');
				} else {
					arrsid = [];
				}

				if(getCookie('cartnum')) {
					arrnum = getCookie('cartnum').split(',');
				} else {
					arrnum = [];
				}
			}

			function kong() {
				//				console.log(getCookie("cartsid"))
				if(getCookie('cartsid')) {
					$(".cart-empty").hide();
					$(".hasgood").show();
				} else {
					$(".cart-empty").show();
					$(".hasgood").hide();
				}
			}
		})(),
		balance:(function(){
			$(".buy-btn").click(function(){
				if(getCookie("cartsid")){
					
				}else{
					$("#mask").show();
				}
			})
		})(),
		dialog:(function(){
			$(".totalPrice .buy-btn").click(function(){
				if(getCookie("username")){//已登录
					location.href="index.html"
				}else{//未登录
					$("#mask").show();
				}
			})
			$(".closeFrame").click(function(){
				$("#mask").hide();
			});
			
			
			$(".mustlogin-head p").click(function(){
				$(".must-content-inner").eq($(this).index()).show().siblings().hide();
				$(this).addClass("act").siblings().removeClass("act");
			});
		})(),
		login:(function(){
			$(".must-tologin-btn").click(function(){
				var username=$(".username").val();
				var pwd=$(".pwd").val();
				$.ajax({
					type:"post",
					url:"php/login.php",
					data:{
						user:username,
						pass:pwd
					}
					
				}).done(function(data){
					if (data) {//用户名密码正确
						console.log("用户名密码正确")
						$(".pwd-error").html("");
						addCookie("username",username,7);
//						if ($(".agree-icon").hasClass("checkagree")) {//记住用户名
//							addCookie("menuser",username,7);
//						}else{
//							delCookie("menuser",username);
//						}
						location.href="index.html";
					} else{
						console.log("错误")
						$(".pwd-error").html("用户名或密码错误，请重试");
						
					}
				})
			})
		})()

	}
})