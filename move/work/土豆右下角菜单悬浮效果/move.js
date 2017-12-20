function getstyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj)[attr];
	}
}
function bufferMove(obj,json,fn){//attr如果是opacity，target扩大100倍
	clearInterval(obj.timer);//防止重复点击元素。
	obj.timer=setInterval(function(){
		var bstop=true;//代表所有的元素都已经结束了
		//求初始值
		for(var attr in json){//attr:属性    json[attr]:目标值
			var current=null;
			if(attr=='opacity'){
				current=Math.round(getstyle(obj,attr)*100);//扩大了100倍
			}else{
				current=parseInt(getstyle(obj,attr));
			}
			//求速度
			var speed=( json[attr]-current)/5;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			//判断停止
			if(current!= json[attr]){//如果任意一个元素没有到目标，继续运动。
				//赋值
				if(attr=='opacity'){
					//还原上面扩大了100倍
					obj.style.opacity=(current+speed)/100;
					obj.style.filter='alpha(opacity='+(current+speed)+')';
				}else{
					obj.style[attr]=current+speed+'px';
				}
				bstop=false;//有元素没有到目标点。
			}
		}
		
		if(bstop){
			clearInterval(obj.timer);//一个运动完成了，定时器关闭了。
			fn&&fn();//如果fn存在，调用fn();
		}
	},30);
}