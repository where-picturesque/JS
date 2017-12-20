define(['jquery'],function($){
	return {
		
		
		//检测用户名
		checkuser:(function(){
			//用户名获取焦点
			$(".phone-inp").focus(function(){
				var phonenum=$(this).val();
				if (phonenum) {//手机号有值
					var reg=/^\d{11}$/;
					if (reg.test(phonenum)){
						console.log("格式正确")
					}else{//格式不正确
						console.log("用户名格式不正确")
						$(this).parent(".div-input").find(".warning .wraning-text").html("请输入正确的手机号码");
					}
				} else{//手机号为空
					$(this).parent(".div-input").find(".warning .wraning-text").html("手机号不能为空");
				}
				
			})
			
			
		})(),
//		检测密码
		checkpwd:(function(){
			//用户名失去焦点
			$(".phone-inp").blur(function(){
				var phonenum=$(this).val();
				var $user=$(this);
				var reg=/^1\d{10}$/;
				if (reg.test(phonenum)) {//手机号码格式正确
					$.ajax({
						type:"post",
						url:"php/reg.php",
						datatype:"json",
						data:{
							username:phonenum
						},
						async:false
					}).done(function(data){
						if(data){//返回1：用户已存在
							var warningtext='该手机号已注册，请更换，或<a href="login.html">直接登录</a>'
							$user.parent(".div-input").find(".warning .wraning-text").html(warningtext);
							console.log("用户名已存在")
						}else{//新用户
							console.log("新用户")
							$user.parent(".div-input").find(".i-if-success").show();	
						}
					})
				} else{//格式不正确
					$(this).addClass("input-warning");
					$(this).parent(".div-input").find(".warning .wraning-text").html("请输入正确的手机号码")
				}
			})
			function charMode(char){
				//48-57 数字 65-90 大写字母  97-122 小写字母
				if(char>=48&&char<=57){
					return 1;
				}else if(char>=65&&char<=90){
					return 2;
				}else if(char>=97&&char<=122){
					return 4;
				}else{
					return 8;
				}
			}
			//密码等级
			$(".password-inp").on("input",function() {
				$(".pwd-level").show();
				var passwordnum=$(this).val();
				var end1 = 0,
					end2 = 0,
					end3 = 0,
					end4 = 0,
					result = 0;
					for(var i=0; i<passwordnum.length;i++){
						if(charMode(passwordnum.charCodeAt(i)) == 1){
							end1 = 1;
						}else if(charMode(passwordnum.charCodeAt(i)) == 2){
							end2 = 1;
						}else if(charMode(passwordnum.charCodeAt(i)) == 4){
							end3 = 1;
						}else if(charMode(passwordnum.charCodeAt(i)) == 8){
							end4 = 1;
						}					
						result = end1 + end2 + end3 + end4;					
					}
					console.log(result)
					if(result == 1){//弱
						$(".pwd-level .low").css("background","#ff0000").siblings(".pwd-level-color").css("background","#d4d4d2");
					}else if(result == 2){//中
						console.log("中")
						$(".pwd-level .low,.middle").css("background","#ffa200");
						$(".pwd-level .high").css("background","#d4d4d2");
					}else if(result == 3){//强
						console.log("高")
						$(".pwd-level-color").css("background","#00c500");;
					}					
				
			})
			
			
			//密码验证
			$(".password-inp").blur(function(){
				var passwordnum=$(this).val();
				if (passwordnum!="") {//密码不为空
					var reg=/^(\w){6,20}$/;
					if (reg.test(passwordnum)) {//密码格式符合
						console.log("格式正确")
						$(this).parent(".div-input").find(".i-if-success").show();	
						$.ajax({
							type:"post",
							url:"php/reg.php",
							async:false
						});
					} else {//格式错误
						console.log("密码格式不正确")
						$(this).parent(".div-input").find(".warning .wraning-text").html("密码格式不正确,密码由6-20位字母，数字和下划线组合，区分大小写")
					}
				} else {//密码为空
					$(this).parent(".div-input").find(".warning .wraning-text").html("密码不能为空");
					$(".pwd-level-color").css("background","#d4d4d2");
				}
			});
			
			
			//确认密码
			$(".checkpwd-inp").on("blur",function(){
				if ($(this).val()==$(".password-inp").val()) {
					$(this).parent(".div-input").find(".i-if-success").show();
				} else{
					$(this).parent(".div-input").find(".warning .wraning-text").html("两次密码输入不一致，请重新输入");
				}
				
			})
			
			
		})(),
		
		//验证码
		checkcode:(function(){
			$("#Txtidcode").blur(function(){
				if($(this).val()==$(".createcode").html()){
					console.log("验证码正确")
					$(this).parent(".div-input").find(".i-if-success").show();
				}else{
					
				}
			})
			$(".createcode").click(function(){
				createCode();
			});
			
			function createCode(){
//				console.log("更换")
				var count=0
				var str=""
				for (var i=0; count<=4; i++) {
					var num = Math.floor(Math.random()*(122-48+1))+48
					// console.log(num)
					if (num>48&&num<57 || num>65&&num<90 ||num>97&&num<122) {
						count++;
						
						str+=String.fromCharCode(num)
					}
				}
				console.log(str)
				$(".createcode").html(str)
			}
			createCode();
		})(),
		
		
		//同意条款
		agree:(function(){
			$(".agree .agree-icon,.agree-txt").on("click",function(){
				console.log(1)
				$(this).toggleClass("checkagree");
			})
		})(),
		//注册
		reg:(function(){
			$(".regForm").submit(function(){
				
				var inpLength=$(".regForm .i-if-success").size();
				var count=0;
				for(var $i=0;$i<inpLength;$i++){
					var display=$(".regForm .i-if-success").eq($i).css("display");
					if (display=="block") {
						count++;
					}
				}
				console.log(count)
				if (count==inpLength && $(".agree .agree-icon").hasClass("checkagree") ) {//可以跳转
					return true;
				}else{
					return false;
				}
			})
		})(),
		
		//输入框获取 失去焦点
		focusblur:(function(){
			//获取焦点
			$(".regForm .div-input input").focus(function(){
				if ($(this).hasClass("input-warning")) {//输入框获取过焦点且没有输入值
					showerror($(this).parent(".div-input").find(".warning"));
					$(this).removeClass("input-warning");
				} else{//输入框未获取过焦点
					showerror($(this).parent(".div-input").find(".notice"))
				}
				right=$(this).parent(".div-input").find(".i-if-success").css("display");
				if (right=="block") {
					$(this).parent(".div-input").find(".i-if-success").css("display","none");
				}
				
			})	
			//失去焦点
			$(".regForm .div-input input").blur(function(){
				var right=$(this).parent(".div-input").find(".i-if-success").css("display");
				if (right=="none") {//输入不正确
					hideerror($(this).parent(".div-input").find(".notice"))
					hideerror($(this).parent(".div-input").find(".warning"))
					$(this).addClass("input-warning");
				}
			})
			$(".regForm .div-input input").on("input",function(){
				hideerror($(this).parent(".div-input").find(".notice"))
				hideerror($(this).parent(".div-input").find(".warning"))
			})
			
			function showerror(obj){
				$(obj).show().css("opacity",0);
				$(obj).animate({
					"opacity":1,
					"bottom":"100%"
				});		
			}
			function hideerror(obj){
				$(obj).hide().css("bottom","120%");
					
			}
		})()
		
		
		
	}
})