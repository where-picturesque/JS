<?php
	header('content-type:text/html;charset=utf-8');
	$conn=mysql_connect("localhost","root","123456") or die("数据库连接失败");
	mysql_query("SET NAMES UTF8");
	mysql_select_db("project",$conn);
	
	
?>