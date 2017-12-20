<?php
	require "conn.php";
	header('content-type:text/html;charset=utf-8');
	
	//商家商标
	$query="select * from brand";
	$result=mysql_query($query);
	$brand=array();
	for($i=0;$i<mysql_num_rows($result);$i++){
		$brand[$i]=mysql_fetch_array($result,MYSQL_ASSOC);//获取查询结果
	}
//详情页
	$query1="select * from detail";
	$result1=mysql_query($query1);
	$detail=array();
	for($i=0;$i<mysql_num_rows($result1);$i++){
		$detail[$i]=mysql_fetch_array($result1,MYSQL_ASSOC);//获取查询结果
	}
//轮播图	
	$query3="select * from banner";
	$result3=mysql_query($query3);
	$lunbo=array();
	for($i=0;$i<mysql_num_rows($result3);$i++){
		$lunbo[$i]=mysql_fetch_array($result3,MYSQL_ASSOC);//获取查询结果
	}
	
	
	class Info{};
	$info=new Info();
	$info->brand=$brand;
	$info->detail=$detail;
	$info->lunbo=$lunbo;
	
	echo json_encode($info);
?>