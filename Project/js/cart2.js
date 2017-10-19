define(['jquery', 'cookie'], function() { //引入插件
	return {
		//推荐商品
		recommend: (function() {
			$.ajax({
				type: "get",
				url: "http://127.0.0.1/Project/php/brandgood.php?__hbt=1508247254207",
				async: false,
				dataType: "json"
			}).done(function(data) {
				var detail = data.detail;
				//				console.log(detail)
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
				
				$(".recommend-btn").click(function() {
					var cartList = [];
					cartList = cookieToArray("cartList"); //刷新时，如果cookie存在cartList=原来的cartList

					var sid = $(this).parents(".goodsinfo").find(".loadimg").attr("sid");
					var num = 1;
					var i = 0;
					for(i = 0; i < cartList.length; i++) {
						if(cartList[i].sid == sid) { //cookie中已存在该商品			
							cartList[i].num++;
							$(".goods-item:visible").each(function() {
								if(sid == $(this).find(".goods-pic a img").attr("sid")) { //存在
									console.log("存在")
									var num = $(this).find('.quantity-form input').val();
									num++;
									$(this).find('.quantity-form input').val(num);;
									var perprice = $(this).find(".b-price strong").html()
									$(this).find(".b-sum strong").html(num * perprice); //总价
								}
							})
							break;
						}
					}
					if(i == cartList.length) { //添加新商品
						var obj = {
							sid: sid,
							num: num
						};
						cartList.push(obj);

						createitem(obj);
					}
					//		addCookie("cartList",cartList,7);
					document.cookie = "cartList=" + JSON.stringify(cartList) + ";expires=" + new Date() + 7;
				})
				
				
			function cookieToArray(key) {
				var sign = true;
				var arr = document.cookie.split("; ");
				for(var i = 0; i < arr.length; i++) {
					var arr2 = arr[i].split("=");
					if(arr2[0] == key) {
						sign = false; //找到需要的cookie
						//console.log(JSON.parse(arr2[1]))
						return JSON.parse(arr2[1]);
					}
				}
				if(sign) { //cookie不存在
					cardList = [];
					return [];
				}
			}

		})()

			
		}
})