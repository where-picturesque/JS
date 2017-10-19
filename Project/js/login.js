define(['jquery','cookie'],function($){
	return {
		usernameinit:(function(){//用户名初始化
			if(getCookie("username")&&getCookie("menuser")){//是否选择记住用户名
				$(".username .username-inp").val(getCookie("username"));
			};
		})(),
		
		memName:(function(){
			$(".agree-icon,.agree-txt").on("click",function(){
				$(".agree-icon").toggleClass("checkagree");
			})
		
		})(),
		check:(function(){
			//用户名失去焦点
			$(".username-inp").blur(function(){
				var username=$(this).val();
				if (username!="") {//用户名不为空
					$(this).removeClass("inp-error");
					$(this).siblings(".error").html("");
				} else{//用户名为空
					$(this).addClass("inp-error");
					$(this).siblings(".error").html("用户名不能为空");
				}
			})
			//密码失去焦点
			$(".password-inp").blur(function(){
				var pwd=$(this).val();
				if (pwd!="") {//用户名不为空
					$(this).removeClass("inp-error");
					$(this).siblings(".error").html("");
				} else{//用户名为空
					$(this).addClass("inp-error");
					$(this).siblings(".error").html("请输入密码");
				}
			})
			$(".login-btn").click(function(){
				var username=$(".username-inp").val();
				var pwd=$(".password-inp").val();
				$.ajax({
					type:"post",
					url:"http://127.0.0.1/Project/php/login.php?__hbt=1508158869515",
					data:{
						user:username,
						pass:pwd
					}
					
				}).done(function(data){
					if (data) {//用户名密码正确
						console.log("用户名密码正确")
						$(".pwderror").html("");
						addCookie("username",username,7);
						if ($(".agree-icon").hasClass("checkagree")) {//记住用户名
							addCookie("menuser",username,7);
						}else{
							delCookie("menuser",username);
						}
						location.href="index.html";
					} else{
						console.log("错误")
						$(".pwderror").html("用户名或密码错误，请重试")
					}
				})
			})
			
		})()
	}
})