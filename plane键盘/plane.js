var gamearea=document.getElementById("gamearea")
var gameScore=document.getElementById("score").getElementsByTagName("span")[0]
var totalScore=0;

//我方飞机构造函数
function MyPlane(width,height,x,y,imgurl,boomurl){
	this.width=width;
	this.height=height;
	this.x=x;
	this.y=y;
	this.imgurl=imgurl;
	this.boomurl=boomurl;
	this.posi=new Object();
	this.createMyPlane();
}
//创建我方飞机
MyPlane.prototype.createMyPlane=function(){
	this.myplane=document.createElement("img");
	this.myplane.src=this.imgurl;
	this.myplane.style.cssText="width:"+this.width+"px;height:"+this.height+"px;position:absolute;left:"+this.x+"px;top:"+this.y+"px;"
	gamearea.appendChild(this.myplane);
	this.move();
	this.shoot();
}
//我方飞机移动
MyPlane.prototype.move=function(){
	var that=this;
	document.addEventListener("keydown",this.planemoveA=function(){
		that.planemovedown();
	});	
	document.addEventListener("keyup",this.planemoveB=function(){
		that.planemoveup();
	})
}

MyPlane.prototype.planemovedown=function(e){
	var e=e||event;
	console.log(e.keyCode)//W:87,A:65,S:83,D:68
	this.mleft=this.myplane.offsetLeft;
	this.mtop=this.myplane.offsetTop;
	this.posi[e.keyCode]=true;
	console.log(this.posi)
	for(var keycode in this.posi){
		if (keycode==87 &&this.posi[keycode]) {
			this.mtop-=5
		}
		if (keycode==83 &&this.posi[keycode]) {
			this.mtop+=5;
		}
		if (keycode==65 && this.posi[keycode]) {
			this.mleft-=5;
		}
		if (keycode==68 && this.posi[keycode]) {
			this.mleft+=5
		}
	}
	
	if (this.mleft<0) {
		this.mleft=0
	}else if(this.mleft>gamearea.offsetWidth-this.myplane.offsetWidth){
		this.mleft=gamearea.offsetWidth-this.myplane.offsetWidth
	}
	if (this.mtop<0) {
		this.mtop=0
	} else if(this.mtop>gamearea.offsetHeight-this.myplane.offsetHeight){
		this.mtop=gamearea.offsetHeight-this.myplane.offsetHeight
	}
	this.myplane.style.left=this.mleft+"px"
	this.myplane.style.top=this.mtop+"px"
	return false;
}
MyPlane.prototype.planemoveup=function(e){
		var e=e||event;
		this.posi[e.keyCode]=false;

}
	var bulletcount=1;
//子弹构造函数
function Bullet(width,height,x,y,imgurl){
	this.width=width;
	this.height=height;
	this.x=x;
	this.y=y;
	this.imgurl=imgurl;
	this.createBullet();
}
//创建子弹
Bullet.prototype.createBullet=function(){
	this.bullet=document.createElement("img");
	this.bullet.src=this.imgurl;
	this.bullet.style.cssText="width:"+this.width+"px;height:"+this.height+"px;position:absolute;left:"+this.x+"px;top:"+this.y+"px";
	gamearea.appendChild(this.bullet);
		console.log("创建子弹")
	this.bulletmove();
	
}
//子弹移动
Bullet.prototype.bulletmove=function(){
	// this.speed=speed;
	var that=this;
	this.bulletmovetimer=setInterval(function(){
		that.y-=5
		if(that.y<=-that.height){
			clearInterval(that.bulletmovetimer);
			 gamearea.removeChild(that.bullet);
		}
		that.bullet.style.top=that.y+"px";
		that.bulletHit();
	})
	
}
//子弹与敌机发生碰撞
Bullet.prototype.bulletHit=function(){
	var enemys=document.querySelectorAll('.enemy');
	for (var i = 0; i < enemys.length; i++) {
		if ((this.x+this.width)>=enemys[i].offsetLeft && this.x<=(enemys[i].offsetLeft+enemys[i].offsetWidth) && (this.y+this.height)>=enemys[i].offsetTop && this.y<=(enemys[i].offsetTop+enemys[i].offsetHeight)) {//发生碰撞
			console.log("子弹与敌机发生碰撞")
			clearInterval(this.bulletmovetimer);//子弹停止运动
			try{
				gamearea.removeChild(this.bullet);//移除子弹
		    }catch(e){//防止一颗子弹与多架敌机碰撞
		    	return ;
		    }
		    enemys[i].blood--;
		    enemys[i].checkBlood();//检测敌机血量
		}

	}
}
//我方飞机发射子弹
MyPlane.prototype.shoot=function(){
	var that=this;
	document.addEventListener("keydown",this.shootA=function (){
		that.shootdown();
	})
	document.addEventListener("keyup", this.shootB=function(){
		that.shootup();
	})

}
//按下Ctrl键发射子弹
MyPlane.prototype.shootdown=function(e){
	var e=e||event;	
	var that=this;
	// clearInterval(that.cbullettimer)
	if (e.ctrlKey) {
		function cbullet(){//this-->window
			if (bulletcount==1) {
				new Bullet(6,14,that.mleft+that.myplane.offsetWidth/2-3,that.mtop-14,"img/bullet.png")
			} else {
				new Bullet(6,14,that.mleft+that.myplane.offsetWidth/3,that.mtop-that.myplane.offsetHeight/2,"img/bullet.png")
				new Bullet(6,14,that.mleft+that.myplane.offsetWidth/3*2,that.mtop-that.myplane.offsetHeight/2,"img/bullet.png")
			}
			
		}
		cbullet();
		that.cbullettimer=setInterval(cbullet,500)
	}	
}
	
MyPlane.prototype.shootup=function(e){
	var e=e||event;	
	console.log(e.ctrlKey)//false
	if (e.keyCode==17 &&e.ctrlKey==false){//e.keyCode==17  ctrl键
		clearInterval(this.cbullettimer)
	}
	
}
//敌机构造函数
function Enemy(width,height,x,y,imgurl,boomimg,speed,blood,score){
	this.width=width;
	this.height=height;
	this.x=x;
	this.y=y;
	this.imgurl=imgurl;	
	this.boomimg=boomimg;	
	this.speed=speed;
	this.blood=blood;
	this.score=score;
	this.createEnemy();
}
//创建敌机
Enemy.prototype.createEnemy=function(){
	this.enemy=document.createElement("img");
	this.enemy.src=this.imgurl;
	this.enemy.style.cssText=`width:${this.width}px;height:${this.height}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
	this.enemy.className='enemy';//给每架敌机添加一个类，方便后面获取
	gamearea.appendChild(this.enemy);
	this.enemy.blood=this.blood;
	this.enemy.speed=this.speed;
	this.enemy.score=this.score;
	var that=this
	this.enemy.checkBlood=function(){
		if (this.blood<=0) {
			this.src=that.boomimg;//更改图片
			this.className='';//清空类名
			clearInterval(that.enemy.enemymovetimer)
			var timer=setTimeout(function(){
				gamearea.removeChild(that.enemy);
			},2000)
			totalScore+=this.score;
			gameScore.innerHTML=totalScore
		}
	}
	this.enemyMove();
	
}
//敌机移动
Enemy.prototype.enemyMove=function(){
	var that=this;
	this.enemy.enemymovetimer=setInterval(function(){
		that.y+=that.speed;
		if(that.y>=gamearea.offsetHeight){//敌机飞出游戏界面
			clearInterval(that.enemy.enemymovetimer);
			gamearea.removeChild(that.enemy);
		}
		that.enemy.style.top=that.y+'px';
		that.enemyHit();
	},20)

}
//敌机与我方飞机发生碰撞
Enemy.prototype.enemyHit=function(){
	if ((this.width+this.x)>plane.mleft && this.x<(plane.mleft+plane.width)&& (this.y+this.height)>=plane.mtop && this.y<=(plane.mtop+plane.height)) {//发生碰撞
		var enemys=document.querySelectorAll('.enemy');
		console.log("我方飞机碰撞")
		for (var i = 0; i < enemys.length; i++) {
			clearInterval(enemys[i].enemymovetimer)	
		}
		clearInterval(cenemytimer)
		console.log(plane)
		document.removeEventListener("keydown",plane.planemoveA);
		document.removeEventListener("keyup",plane.planemoveB);
		document.removeEventListener("keydown",plane.shootA);
		document.removeEventListener("keyup",plane.shootB);
		plane.myplane.src=plane.boomurl;
		setTimeout(function(){
			alert('game over!!');
			window.location.reload();//刷新。
		},1000)	
	}
	

}
//创建敌机
var cenemytimer=setInterval(function(){
	/*for(var i=0;i<ranNum(1,5);i++){
		var cnum=ranNum(1,20);
		console.log(cnum)
		if (cnum<13) {
			console.log("小飞机");
			new Enemy(34,24,ranNum(0,gamearea.offsetWidth-34),-24,'img/smallplane.png','img/smallplaneboom.gif',ranNum(1,3),1,1);
		} else if(cnum>=13 && cnum<17){
			console.log("中飞机");

			new Enemy(46,60,ranNum(0,gamearea.offsetWidth-46),-60,'img/midplane.png','img/midplaneboom.gif',ranNum(1,2),3,3);
		}else{
			console.log("大飞机");
			new Enemy(110,164,ranNum(0,gamearea.offsetWidth-110),-164,'img/bigplane.png','img/bigplaneboom.gif',ranNum(1,1),10,10);			
		}
	}*/
	// 根据分数产生敌机

	for (var i = 0; i < ranNum(1,5); i++) {
		if (totalScore!=0 && totalScore%20==0) {
			new Enemy(110,164,ranNum(0,gamearea.offsetWidth-110),-164,'img/bigplane.png','img/bigplaneboom.gif',ranNum(1,1),10,10);	
			bulletcount=1;	
			// totalScore+=1	
		} else if(totalScore!=0 &&totalScore%10==0){
			new Enemy(46,60,ranNum(0,gamearea.offsetWidth-46),-60,'img/midplane.png','img/midplaneboom.gif',ranNum(1,2),3,3);
			bulletcount=2
			// totalScore+=1
		}else{
			new Enemy(34,24,ranNum(0,gamearea.offsetWidth-34),-24,'img/smallplane.png','img/smallplaneboom.gif',ranNum(1,3),1,1);
			bulletcount=1;	
		}
	}
},2000)
var plane=new MyPlane(66,80,gamearea.offsetWidth/2-33,gamearea.offsetHeight-80,"img/myplane.gif","img/myplaneBoom.gif");
function ranNum(min,max){
	return Math.floor(Math.random()*(max-min+1))+min;
}
