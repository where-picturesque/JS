define(['jquery', 'cookie'], function($) {
	return {
		getInfo: (function() {
//			alert(1)
			function GetQueryString(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if(r != null){
					return unescape(r[2]);
				} else{
					return 3;
				}
				
			}
//			alert(1)
//			console.log(GetQueryString("id"))
//			alert(2)
			$.ajax({
				url: 'php/detail.php',
				data: {
					id: GetQueryString("id")
				},
				dataType: ' json'
			}).done(function(data) {
				//console.log(data[0])
//				console.log(data[0])
				data = data[0]
				$(".product-show .title .shop").html(data.shopname);
				$(".product-show .title span").html(data.title);
				//放大镜
				$(".bigimg-box img.small-Img").attr("src", data.url);
				$(".bigimg-box img.big-Img").attr("src", data.url);
				for(var $j = 0; $j < 2; $j++) {
					for(var $i = 0; $i < 4; $i++) {
						var $clonelistImg = $(".list-img-ex").clone(true);
						$clonelistImg.appendTo($(".moreImg-ul")).removeClass("list-img-ex");
						var url = "url" + $i;
						//							console.log(url)
						$clonelistImg.find("img").attr("src", data[url])

					}
				}

				$(".goodid-txt").html(data.goodid)
				//右侧信息
				if(data.shopname) {
					$(".shopname").html(data.shopname)
				}
				$(".goodname").html(data.title);
				$(".goodname").attr("sid", data.id);
				//定时器
				var time = data.time;
//				console.log(time)
				var exp = time.match(/\d+/g);
//				console.log(exp)
				var day=exp[0]
				$(".pro-time-inner .day").html(day)
				
				var hour=exp[1];
				$(".pro-time-inner .hours").html(hour);
				$(".pro-time-inner .minutes").html(exp[2]);
				$(".pro-time-inner .seconds").html(exp[3])
				//现价
				var start = /\d/.exec(data.price).index;
				var nowPrice = data.price.substring(start);
				$(".J-price").html(nowPrice);
				//折扣
				$(".J-discount").html(data.discount);
				//原价
				var start = /\d/.exec(data.originprice).index;
				var oPrice = data.originprice.substring(start);
				$(".J-mPrice").html(oPrice)

				//唯品币
				$(".vipmoney-num").html(data.vipmoney)

			})

		})(),
		//商品数量加减
		numchange: (function() {
			//减

			$(".num-box .num-reduce").click(function() {
				var goodNum = $(".num-box .num-input").html();

				var canreduce = $(".num-box .num-reduce").hasClass("num-reduce-disabled");
				//			console.log(canreduce);
				if(!canreduce) {
					var goodNum = $(".num-box .num-input").html();
					goodNum--;
					$(".num-box .num-input").html(goodNum);
				}
				if(goodNum == 1) {
					$(this).addClass("num-reduce-disabled");
				} else {
					$(this).removeClass("num-reduce-disabled");
				}

			});
			$(".num-box .num-add").click(function() {
				var goodNum = $(".num-box .num-input").html();

				goodNum++;
				$(".num-box .num-input").html(goodNum);
				if(goodNum == 1) {
					$(".num-box .num-reduce").addClass("num-reduce-disabled");
				} else {
					$(".num-box .num-reduce").removeClass("num-reduce-disabled");
				}
			})

		})(),
		//加入购物车
		addToCart: (function() {
			$(".addToCartinner").click(function() {
				console.log("add")
				var arrsid = [];
				var arrnum = [];
				cookieToArray();
				var sid = $(".goodname").attr("sid");
				var num = $(".num-box .num-input").html();
				arrsid.push(sid);
				arrnum.push(num);
				addCookie('cartsid', arrsid.toString(), 7);
				addCookie('cartnum', arrnum.toString(), 7);
				location.href = "cart.html";
			})

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
		})(),

		//关闭尺码助手
		closeSize: (function() {
			$(".close-help").on("click", function() {
				console.log(1)
				$("#size-help").hide()
			})
		})(),
		zoom: (function() {
			$(".list-img").click(function() {
				$(".small-Img").attr("src", $(this).find("img").attr("src"));
				$(".big-Img").attr("src", $(this).find("img").attr("src"));
			});
			$(".bigimg-box").on("mouseover", function() {
				$(".zoom").show();
				$(".small-Img").hide();
				$(".big-Img").show();
				var scale = $(".big-Img").width() / $(".bigimg-box").width();
				$(".zoom").width($(".bigimg-box").width() / scale);
				$(".zoom").height($(".bigimg-box").height() / scale);
				//				console.log($(".zoom").width());
				//				console.log(scale);

				$(".bigimg-box").on("mousemove", function(e) {
					var mleft = e.pageX - $(this).offset().left - $(".zoom").width() / 2;
					var mtop = e.pageY - $(this).offset().top - $(".zoom").height() / 2;
					if(mleft < 0) {
						mleft = 0
					} else if(mleft > $(this).width() - $(".zoom").width()) {
						mleft = $(this).width() - $(".zoom").width();
					}
					if(mtop < 0) {
						mtop = 0
					} else if(mtop > $(this).height() - $(".zoom").height()) {
						mtop = $(this).height() - $(".zoom").height();
					}

					$(".zoom").css({
						top: mtop,
						left: mleft
					})

					$(".big-Img").css({
						top: -scale * mtop + "px",
						left: -scale * mleft + "px"
					})

				})
			})
			$(".bigimg-box").on("mouseout", function() {
				$(".zoom").hide();
				$(".small-Img").show();
				$(".big-Img").hide()
			})
			var perimgWidth = $(".list-img img").width();
			$("#right").click(function() {
				if($(".moreImg-ul").position().left > -($(".moreImg-ul").width() - $(".moreImg-box").width())) {
					$(".moreImg-ul").stop(true, true).animate({
						left: $(".moreImg-ul").position().left - perimgWidth + "px"
					})
				}

			});

			$("#left").click(function() {
				console.log($(".moreImg-ul").position())
				if($(".moreImg-ul").position().left != 0) {
					$(".moreImg-ul").stop(true, true).animate({
						left: $(".moreImg-ul").position().left + perimgWidth + "px"
					})
				}

			});

		})(),
		
		sidebar: (function() {
			$(".sidebar-nav li").has(".sidebarcom-hover").hover(function() {
				$(this).find(".sidebarcom-hover").addClass("curr");
				$(this).addClass("hover")
			}, function() {
				$(this).find(".sidebarcom-hover").removeClass("curr");
				$(this).removeClass("hover")
			})

			$(".sidebar-ft .totop").click(function() {
				$(window).scrollTop(0);
			})
		})()
		

	}
})