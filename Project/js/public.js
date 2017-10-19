define(['jquery', 'cookie'], function($) {
	return {

		userlogin: (function() {
			if(getCookie("username")) { //已登录
				$(".top-nav .logged").show();
				$(".top-nav .login").hide();
				$(".top-nav .register").hide();
				$(".top-nav .logged .username").html(getCookie("username"));
				$(".top-nav .logged .username-text").html(getCookie("username"));

				console.log(getCookie("username"));
				$(".unsign").hide();
				$(".product-table").show();
				
				//		购物车数量
				if(getCookie("cartsid")) {//有物品
					console.log(getCookie("cartsid"))
					$(".product-table-title").hide();
					
					var goodsid = getCookie("cartsid").split(",");
					console.log(goodsid)
					$(".header-cart .num").html(goodsid.length);
					var goodnum = getCookie("cartnum").split(",");
					console.log(goodnum)
					
					for (var $i=0;$i<goodsid.length;$i++) {
						creategoods(goodsid[$i],goodnum[$i]);
					}
					
				} else {//空购物
					$(".header-cart .num").html(0);
					$(".product-table-title").show();
				}
				$(".header-cart .text").click(function(){
//					alert(1)
					location.href="cart.html";
				})
				
				
				
				
			} else { //未登录
				$(".top-nav .logged").hide();
				$(".top-nav .login").show();
				$(".top-nav .register").show();
				$(".product-table").hide();
			}
			//退出登录
			$(".quitlogin").click(function() {
				delCookie("username", getCookie("username"))
			})
			
			function creategoods(sid, num) {
				//				console.log("create");
				$.ajax({
					type: "get",
					url: "http://127.0.0.1/Project/php/brandgood.php?__hbt=1508247254207",
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
			
			

		})(),
		//选择地址
		selectarea: (function() {
			$(".area td span").click(function() {
				$(".province").html($(this).html())
			})
		})(),

		//下拉列表
		downlist: (function() {
			$(".location,.header-cart,.top-nav li").not(".signin").has(".top-nav-box").hover(function(e) {
				//					console.log(e.target);
				$(this).children(".top-nav-box").show();
				$(this).css({ //li本身
					background: "#ffffff",
					borderColor: "#cdcdcd"
				});
				$(this).children(".sprit").css({ //斜杠消失
					visibility: "hidden"
				});
				//三角形变上下指向
				$(this).children("i.select").removeClass("select").addClass("selected");

			}, function() {
				$(this).children(".top-nav-box").hide();
				$(this).css({
					background: "#f5f5f5",
					borderColor: "transparent"
				});
				$(".header-cart").css({
					borderColor: "#dddddd"
				})
				$(this).children(".sprit").css({
					visibility: "visible"
				});
				$(this).children("i.selected").removeClass("selected").addClass("select");
			})
			//签到动画
			$(".top-nav li.signin").hover(function() {
				$(this).children(".top-nav-box").show().css({
					opacity: 0
				});
				$(this).children(".top-nav-box").animate({
					opacity: 1,
					top: "25px"
				});
			}, function() {
				$(this).children(".top-nav-box").hide().css({
					top: "40px"
				});
			});
		})(),
		hoverRed: (function() {
			$(".top-nav a,td span").hover(function() {
				$(this).addClass("hover-red");
			}, function() {
				$(this).removeClass("hover-red")
			})
		})(),
		loadImg: (function() {
			$(window).on('scroll', function() { //当页面滚动的时候绑定事件
				$('#main img').each(function() { //遍历所有的img标签
					if(checkShow($(this)) && !isLoaded($(this))) {
						// 需要写一个checkShow函数来判断当前img是否已经出现在了视野中
						//还需要写一个isLoaded函数判断当前img是否已经被加载过了
						loadImg($(this)); //符合上述条件之后，再写一个加载函数加载当前img
					}
				})
			})

			function checkShow($img) { // 传入一个img的jq对象
				var scrollTop = $(window).scrollTop(); //即页面向上滚动的距离
				var windowHeight = $(window).height(); // 浏览器自身的高度
				var offsetTop = $img.offset().top; //目标标签img相对于document顶部的位置
				if(offsetTop < (scrollTop + windowHeight) && offsetTop > scrollTop) { //在2个临界状态之间的就为出现在视野中的
					return true;
				}
				return false;
			}

			function isLoaded($img) {
				return $img.attr('data-src') === $img.attr('src'); //如果data-src和src相等那么就是已经加载过了
				//		return $img.CSS("height","216");

			}

			function loadImg($img) {
				$img.attr('src', $img.attr('data-src')); // 加载就是把自定义属性中存放的真实的src地址赋给src属性
				//   $img.CSS("height","216");
			}
		})()
	}
})