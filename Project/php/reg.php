<?php	
	header('content-type:text/html;charset=utf-8');
	require "conn.php";
	
	if(isset($_POST['username'])|| isset( $_POST['submit'])){//验证匹配文件不能直接预览。
		$username=@$_POST['username'];
	}else{
		exit ("非法登录");
	}
	
	if($username){
		$query="select * from user where username='$username'";
		$result=mysql_query($query);
		if(mysql_fetch_array($result)){//用户名已存在
			echo true;//true输出1 有重复
		} else {		//用户名不存在
			echo false;//false输出空
		}
	}else{
		echo "用户名未设置";
	}
	//将用户信息添加到数据库	
	if (isset($_POST['submit']) && $_POST['submit']=="立即注册") {
		$username=$_POST['username'];
		$pwd=md5($_POST['password']);
		$query="insert into user values('null','$username','$pwd',NOW())";
		mysql_query($query);
		header('location:../login.html');
	}
	
?>