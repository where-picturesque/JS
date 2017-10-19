define(['jquery', 'cookie', 'lazyload'], function($) {
	return {

		//搜索框
		search: (function() {
			$(".search-input").on("input", function() {
				var data = $(".search-input").val();
				$.ajax({
					type: "get",
					url: "https://category.vip.com/ajax/getSuggest.php?callback=searchSuggestions&warehouse=",
					data: {
						keyword: data
					},
					dataType: "jsonp"
				}).done(function(data) {
					console.log(data.data)
					var li = "";
					for(var i = 0; i < data.data.length; i++) {
						li += '<li><a href="https://category.vip.com/suggest.php?keyword=' + data.data[i].word + '"</a>' + data.data[i].word + '</li>'
					}
					$(".result-ul").html(li);
					$(".result-box").show()
				})
			})
			$(".search-input").focus(function() {
				//				console.log($(".search-input").val())
				if($(".search-input").val() != "") {
					$(".result-box").show();
				}
			})
			$(".search-input").blur(function() {
				$(".result-box").hide();
			})

		})(),
		//鼠标滑过字体变成红色
//		hoverRed: (function() {
//			$(".top-nav a,td span").hover(function() {
//				$(this).addClass("hover-red");
//			}, function() {
//				$(this).removeClass("hover-red")
//			})
//		})(),
		//导航条更多分类
		moreclass: (function() {
			$.ajax({
				url: "http://127.0.0.1/Project/php/moreclass.php?__hbt=1507876410960",
				dataType: "json",
				async: false
			}).done(function(data) {
				var li = "";
				for(var i = 0; i < data.length; i++) {
					li += '<li class="morepart-list">' +
						'<a href="#">' +
						'<img src=' + data[i].url + ' alt="" />' +
						'<div class="shadow">' +
						'<p>' + data[i].title + '</p>' +
						'</div>' +
						'</a>' +
						'</li>'
				}
				$("#nav .nav-left .morepart ul").html(li);
			})
		})(),
		morehover: (function() {
			$("#nav .nav-left .more").hover(function() {
				$(this).find(".morepart").show();
				$(".morepart").on("mouseover", ".morepart-list", function() {
					$(this).find(".shadow").stop(true, true).animate({
						top: "0px"
					}, 500)
				})
			}, function() {
				$(this).find(".morepart").hide();
				$(".morepart").on("mouseout", ".morepart-list", function() {
					$(this).find(".shadow").stop(true, true).animate({
						top: "20px"
					}, 500)
				})
			})
		})(),
		//轮播图加载
		lunbo: (function() {
			$.ajax({
				url: "http://127.0.0.1/Project/php/brandgood.php?__hbt=1508247254207",
				dataType: "json"
			}).done(function(data) {
				data = data.lunbo;
				var li = "";
				var btns = ""
				for(var i = 0; i < data.length; i++) {
					li += '<li >' +
						'<a href="#">' +
						'<img src=' + data[i].url + ' alt="" />' +
						'</a>' +
						'</li>'
					btns += '<li class="over"><span>' + data[i].title + '</span><i>|</i></li>'

				}
				$("#banner .lunbo-imgs ul").html(li);
				$("#banner .btns .btns-ul").html(btns);
			})
		})(),
		//轮播图动画
		lunbomove: (function() {
			var $index = 0;
			var mleft = 0;
			var sign = true;
			var timer = null;
			timer = setInterval(function() {
				$("#right").click();
			}, 1000)

			function lunboMove() {
				var btnsLength = $("#banner .lunbo .btns .btns-ul li").size();
				if($index > btnsLength - 1) {
					$index = 0
				} else if($index < 0) {
					$index = btnsLength - 1;
				}
				//btns下面的滑块移动
				mleft = $index * $(".silder").width();
				//				console.log(mleft)
				$(".silder").stop(true, true).animate({
					left: mleft + "px"
				}, 500, function() {
					sign = true;
				})
				//轮播图图片变化
				$("#banner .lunbo-imgs li").eq($index).fadeIn().siblings("li").fadeOut();

			}
			//鼠标滑过下面的介绍btns时
			$("#banner .lunbo .btns .btns-ul").on("mouseover", "li", function() {
				$index = $(this).index();
				lunboMove();
			})

			//鼠标划入轮播图片
			$("#banner .lunbo-imgs ").hover(function() {
				clearInterval(timer)
				//左右箭头出现
				$(this).children("#left").stop(true, true).animate({
					marginLeft: "0px"
				})
				$(this).children("#right").stop(true, true).animate({
					marginRight: "2px"
				})

			}, function() { //鼠标滑出
				$(this).children("#left").stop(true, true).animate({
					marginLeft: "-33px"
				})
				$(this).children("#right").stop(true, true).animate({
					marginRight: "-31px"
				})
				timer = setInterval(function() {
					$("#right").click();
				}, 1000)
			})
			//点击左右箭头
			$("#right").click(function() {
				if(sign == true) {
					sign = false;
					$index++;
					lunboMove();
					//						console.log($index)
				}

			})
			$("#left").on("click", function() {
				if(sign == true) {
					sign = false;
					$index--;
					lunboMove();
					console.log($index);

				}

			})
		})(),
		//firstShow
		firstShow: (function() {
			$.ajax({
				url: "http://127.0.0.1/Project/php/brandgood.php?__hbt=1508247254207",
				dataType: "json"
			}).done(function(data) {
				//console.log(data)
				data = data.brand;
				var li = "";
				for(var $i = 0; $i < 6; $i++) {
					li += '<li class="hoverOpacity">' +
						'<a href="detail.html?id=' + data[$i].id + '" ><img src="' + data[$i].url + '"/></a>' +
						'</li>'
				}
				$("#firstShow #show .show-ul").html(li);
			})
		})(),
		new: (function() {
			$.ajax({
				url: "http://127.0.0.1/Project/php/brandgood.php?__hbt=1508247254207",
				dataType: "json"
			}).done(function(data) {
				//				console.log(data.brand)
				var brand = data.brand;
				var detail = data.detail;

				//newevery
				for(var $i = 0; $i < 3; $i++) {
					$("#new .newevery .out .out-list").eq($i).find(".outlistImg").attr("src", brand[$i].url);
					for(var $j = 0; $j < 3; $j++) {
						$("#new .newevery .out-list").eq($i).find(".dl dd").eq($j).find("img").attr("src", detail[$i + $j].url);
						$("#new .newevery .out-list").eq($i).find(".dl dd").eq($j).find("a").attr("href", "detail.html?id=" + detail[$i + $j].id);
					}
				}

				//example
				for($i = 0; $i < 8; $i++) {
					//					console.log("example")
					$cloneexlist = $("#new .example-ul .example-hidden").clone(true);
					$cloneexlist.attr("bname", brand[$i].bname);
					$cloneexlist.find(".backbrand").attr("src", brand[$i].url);
					$cloneexlist.find(".inside img").attr("src", brand[$i].logourl);
					$cloneexlist.find(".brandname").html(brand[$i].bname);
					$cloneexlist.find(".rules").html(brand[$i].rules);
					$cloneexlist.addClass("exLi").removeClass("example-hidden").appendTo("#new .example-ul");
				}
			})

			$(".example-ul").on("mouseenter", ".exLi", function() {
				var title = $(this).attr("bname");
				$(this).addClass("blur");
				$(this).children(".goodlist").html(creategoodlist(title));
				$(this).children(".goodlist").fadeIn();

			})
			$(".example-ul").on("mouseleave", ".exLi", function() {
				$(this).removeClass("blur");
				$(this).children(".goodlist").fadeOut();
			})

			function creategoodlist(title) {
				var goodlist = ""
				$.ajax({
					url: "http://127.0.0.1/Project/php/brandgood.php?__hbt=1508247254207",
					dataType: "json",
					async: false
				}).done(function(data) {
					var brand = data.brand;
					var detail = data.detail;
					var listtxt = "";
					goodlist = '<ul class="goodinfo hover-changeO  clear">';
					for(var $i = 0; $i < 3; $i++) {
						//						console.log(detail[$i].url)
						goodlist += '<li class="hoverOpacity gdinfo-list"><a href="detail.html?id=' + detail[$i].id + '"><img src="' + detail[$i].url + '" /></a></li>'
					}
					goodlist += '</ul>'
					//					console.log(title)//可以获取
					for(var $i = 0; $i < brand.length; $i++) {
						//						console.log(brand[$i])
						if(brand[$i].bname == title) {
							listtxt = '<div class="brandinfo">' +
								'<img class="blogo" src="' + brand[$i].logourl + '" />' +
								'<p class="collect"><i class="vipFont"></i><span>收藏品牌</span></p>' +
								'<p class="goin"><a href="#">进入专场</a></p>'
							'</div>'
							goodlist += listtxt;
							break;
						}
					}

				})
				return goodlist;

			}
		})(),
		//新特卖
		/*
		new: (function() {
			$.when($.ajax({
				url: "http://127.0.0.1/Project/php/allinfo.php?__hbt=1508247254207",
				async:false,
				dataType: "json"
			}),$.ajax({
					url: "http://127.0.0.1/Project/php/detail.php?__hbt=1507951005006",
				async:false,
					dataType: "json"
			})).done(function(brand,detail){
				var outlistimg = "";
				console.log(brand)
				for(var $i = 0; $i < 3; $i++) {
					console.log(brand[$i])
					outlistimg = '<img src="' + brand[$i].url + '" alt=""  class="outlistImg"/>'
					$("#new .newevery .out .out-list").eq($i).html(outlistimg);
				}
				//example数据
//				var exdata = brand.slice(9, 17);
				var example = "";
				for(var $i = 0; $i < 8; $i++) {
					console.log(brand[1])
					example += '<li class="exLi" title="'+brand[$i].bname+'">' +
						'<img src="' + brand[$i].url + '" class="backbrand" />' +
						'<div class="inside">' +
							'<img src="' + brand[$i].logourl + '"/>' +
							'<p class="brandname">' + brand[$i].bname + '</p>' +
							'<p class="rules over">' + brand[$i].rules + '</p>' +
						'</div>' +
						'<div class="goodlist"></div>'
						'</li>'
				}
				$("#new .example-ul").html(example);
//				var dldata = detail.slice(1, 10);
					var dl = ""
					for(var $i = 0; $i < 3; $i++) {
						dl = $('<dl class="dl"></dl>')
						var dd = ""
						for(var $j = 0; $j < 3; $j++) {
							dd = $('<dd><img src="' + detail[$i + $j].url + '"  class="ddImg"/></dd>');

							dl.append(dd);
						}

						$("#new .newevery .out .out-list").eq($i).append(dl);
						dl.addClass("dl")
					}
				})
				
				
		
			$(".example-ul").on("mouseenter", ".exLi", function() {
				var title=$(this).attr("title");
				$(this).addClass("blur");
//				creategoodlist(title);
				$(this).children(".goodlist").fadeIn();

			})
			$(".example-ul").on("mouseleave", ".exLi", function() {
				$(this).removeClass("blur");
				$(this).children(".goodlist").fadeOut();
			})

			function creategoodlist(title) {
				$.when($.ajax("http://127.0.0.1/Project/php/detail.php?__hbt=1507951005006"),$.ajax("http://127.0.0.1/Project/php/brand.php?__hbt=1507903466504")).done(function(detail,brand){
					var listtxt = "";
					var goodlist = '<ul class="goodinfo clear"></ul>';
					for(var $i = 0; $i < 3; $i++) {
					goodlist += '<li class="hoverOpacity gdinfo-list"><a href=""><img src="' + detail[$i].url + '" /></a></li>'
				}
//					console.log(title)//可以获取
					for(var $i=0;$i<brand.length;$i++){
						console.log(brand[$i])
						if(brand[$i].bname==title){
							listtxt='<div class="brandinfo">' +
							'<img class="blogo" src="' + brand[$i].logourl + '" />' +
							'<p class="collect"><i class="vipFont"></i><span>收藏品牌</span></p>' +
							'<p class="goin"><a href="#">进入专场</a></p>'
					'</div>'
						goodlist+=listtxt;
						$(".example-ul").children(".goodlist").html(goodlist);
						console.log("成功")
						}
					}
					
					
				})
				

			}
		

		})(),*/
		//Brand
		Brand: (function() {
			/*$(window).scroll(function(){
				var $scrolltop=$(window).scrollTop();
				$(".Brand").each(function(index,item){
					var $Brandtop=$(this).offset().top;
					var clienth=$(window).height();
					var sign=$(item).attr("sign")
//					console.log($(item))
					
					if ($scrolltop>($Brandtop-clienth) &&sign ) {						
						$.ajax({
							url:"http://127.0.0.1/Project/php/brand.php?__hbt=1508045100173",
							dataType:"json",
							async:false
						}).done(function(data){
							console.log(sign)
							for (var $i=0;$i<1,sign==true;$i++) {
								var $cloneBrandItem=$(".floor1-women .example-hidden").clone(true);
								console.log(item)
								$cloneBrandItem.addClass("brand-item").removeClass("example-hidden").appendTo($(item).find(".example-ul"));
								$cloneBrandItem.find(".brand-Img .img-brand-img").attr({
									"data-original":data[$i].url,
									"title":data[$i].title,
									"src":data[$i].url
								});
								
								$cloneBrandItem.find(".brand-Img .img-brand-img").attr("data-original");
								
								if (data[$i].rules) {
									$cloneBrandItem.find(".rule-info-ex").addClass("rule-info")	
								}
								$cloneBrandItem.find(".rule-info .rule-txt").html(data[$i].rules);
								$cloneBrandItem.find(".brand-info .brand-name").html(data[$i].bname);
								var reg=/[\u4e00-\u9fa5]/;
								var exp=reg.exec(data[$i].discount).index;
								var discnum=data[$i].discount.substring(0,exp)
								$cloneBrandItem.find(".brand-info .discount .discnum").html(discnum)
			
							}
							$(item).attr("sign",false);
						})
					}
				})
			})*/
			$(".Brand").each(function(index, item) {
				$(this).attr("sign", true);
			})

			$.ajax({
				url: "http://127.0.0.1/Project/php/brandgood.php?__hbt=1508247254207",
				dataType: "json",
				async: false
			}).done(function(data) {
				data = data.brand;
				$(window).scroll(function() {
					//	console.log("scroll");
					var $scrolltop = $(window).scrollTop(); //滚动条高度
					var clientH = $(window).height(); //当前窗口高度
					$(".Brand").not(":first").each(function(index, item) {
						
						var top = $(this).offset().top;
						//				console.log(top)
						var sign=$(this).attr("sign");
						
						if($scrolltop + 200 > top) {
							//console.log("进入可视区");
							if(sign=="true") {
								console.log("创建")
								$(this).attr("sign", false);
								console.log(sign)
								for(var $i = 2*index; $i < 2*index+6; $i++) {
									var $clone = $(".floor1-women .example-hidden").clone(true);
									$clone.addClass("brand-item").removeClass("example-hidden").appendTo($(this).find(".brand-content .example-ul"));
//									console.log(data[$i])
									$clone.find(".brand-Img .img-brand-img").attr({

										"title": data[$i].bname,
										"src": data[$i].url
									});
									$clone.find(".brand-Img .img-brand-img").attr("data-original");
									if(data[$i].rules) {
										$clone.find(".rule-info-ex").addClass("rule-info")
									}
									$clone.find(".rule-info .rule-txt").html(data[$i].rules);
									$clone.find(".brand-info .brand-name").html(data[$i].bname);
									var reg = /[\u4e00-\u9fa5]/;
									var exp = reg.exec(data[$i].discount).index;
									var discnum = data[$i].discount.substring(0, exp)
									$clone.find(".brand-info .discount .discnum").html(discnum);
								}
								
							}else{
								console.log("不创建")
							}

						}
					})
				})
				
				


				//				for(var $i = 0; $i < 6; $i++) {
				//					var $cloneBrandItem = $(".floor1-women .example-hidden").clone(true);
				//					$cloneBrandItem.addClass("brand-item").removeClass("example-hidden").appendTo($(".floor1-women .example-ul"));
				//					$cloneBrandItem.find(".brand-Img .img-brand-img").attr({
				//						
				//						"title": data[$i].title,
				//						"src": data[$i].url
				//					});
				//
				//					$cloneBrandItem.find(".brand-Img .img-brand-img").attr("data-original");
				//
				//					if(data[$i].rules) {
				//						$cloneBrandItem.find(".rule-info-ex").addClass("rule-info")
				//					}
				//					$cloneBrandItem.find(".rule-info .rule-txt").html(data[$i].rules);
				//					$cloneBrandItem.find(".brand-info .brand-name").html(data[$i].bname);
				//					var reg = /[\u4e00-\u9fa5]/;
				//					var exp = reg.exec(data[$i].discount).index;
				//					var discnum = data[$i].discount.substring(0, exp)
				//					$cloneBrandItem.find(".brand-info .discount .discnum").html(discnum)
				//
				//				}
			})
			$(".brand-content .exLi").hover(function() {
				$(this).find(".brand-Img .collect").fadeIn();
			}, function() {
				$(this).find(".brand-Img .collect").fadeOut();
			})
			$(".brand-content .exLi ").on("mouseover", ".brand-Img .collect", function() {
				$(this).addClass("ui-btn-fav-like");
			});
			$(".brand-content .exLi ").on("mouseout", ".brand-Img .collect", function() {

				$(this).removeClass("ui-btn-fav-like");
			});
		})(),

		hoverOpacity: (function() {
			$(".hover-changeO").on("mouseover", ".hoverOpacity", function() {
				console.log(this)
				$(this).animate({
					opacity: .6
				}, function() {
					$(this).animate({
						opacity: 1
					})
				})
			})
		})(),

		floor: (function() {
			$(window).scroll(function() {
				var $scrolltop = $(window).scrollTop();
				var clientH = $(window).height();
				var starth = $("#shop #new ").offset().top;
				//出现左侧楼层
				if($scrolltop > starth - clientH + 200) {
					$("#floornav").fadeIn();
				} else {
					$("#floornav").fadeOut();

				}
				//楼层fixed
				if($scrolltop > $(".example").offset().top) {
					$("#floornav").addClass("fixed")
				} else {
					$("#floornav").removeClass("fixed")
				}
				//nav固定在顶部
				if($scrolltop > $("#banner").offset().top) {
					$("#nav").addClass("navfixed")
				} else {
					$("#nav").removeClass("navfixed")
				}
				//滚轮滚动对应楼层变化
				$(".floornav-list").each(function(index, item) {
					//每个Brand的offset()
					var $top = $(".Brand").eq(index).offset().top;
					//console.log($top)
					if(($scrolltop+200) > $top) {
						$(".floornav-list").removeClass("curr");
						$(".floornav-list").eq($(this).index()).addClass('curr')

					}
				});

			})

			//点击楼梯
			$(".floornav-list").on("click", function() {
				if($(this).hasClass("hover")) {
					$(this).removeClass("hover")
				}
//				$(this).addClass("curr").siblings(".floornav-list").removeClass("curr");
				var $index = $(this).index(); //当前的索引
				var $top = $('.Brand').eq($index).offset().top; //当前楼梯对应的楼层的top值
				var height=$('.Brand').eq($index).height();

				$('html,body').animate({ //赋值 
					scrollTop: $top -100
				}, 200);

			})
			$(".floornav-list").hover(function() {
				if($(this).hasClass("curr")) {

				} else {
					$(this).addClass("hover").siblings(".floornav-list").removeClass("hover")
				}
			}, function() {
				$(this).removeClass("hover")
			})
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
		})(),
		loadImg:(function(){
			$(window).on('scroll',function () {//当页面滚动的时候绑定事件
			        $('#main img').each(function () {//遍历所有的img标签
			            if (checkShow($(this)) && !isLoaded($(this)) ){
			                // 需要写一个checkShow函数来判断当前img是否已经出现在了视野中
			                //还需要写一个isLoaded函数判断当前img是否已经被加载过了
			               loadImg($(this));//符合上述条件之后，再写一个加载函数加载当前img
			            }
			        })
			    })
			    function checkShow($img) { // 传入一个img的jq对象
			        var scrollTop = $(window).scrollTop();  //即页面向上滚动的距离
			        var windowHeight = $(window).height(); // 浏览器自身的高度
			        var offsetTop = $img.offset().top;  //目标标签img相对于document顶部的位置
			          if (offsetTop < (scrollTop + windowHeight) && offsetTop > scrollTop) { //在2个临界状态之间的就为出现在视野中的
				            return true;
				        }
				        return false;
				    }
				    function isLoaded ($img) {
				        return $img.attr('data-src') === $img.attr('src'); //如果data-src和src相等那么就是已经加载过了
//						return $img.CSS("height","216");
				        
				    }
				    function loadImg ($img) {
				        $img.attr('src',$img.attr('data-src')); // 加载就是把自定义属性中存放的真实的src地址赋给src属性
//                              $img.CSS("height","216");
				    }
		})()

		//		,
		//		//懒加载
		//		lazy: (function() {
		//			
		//		})()

	}
})