<?php
	require "conn.php";
	header('content-type:text/html;charset=utf-8');
	$goodId=isset($_GET['id'])?$_GET['id']:3;
//	echo $goodId;
	$query="select * from detail where id='$goodId'";
	$result=mysql_query($query);
	$arr=array();
	for($i=0;$i<mysql_num_rows($result);$i++){
		$arr[$i]=mysql_fetch_array($result,MYSQL_ASSOC);//获取查询结果
	}
	echo json_encode($arr);	
?>