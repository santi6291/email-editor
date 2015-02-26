<!DOCTYPE html>
<?php require_once($_SERVER['DOCUMENT_ROOT'] . '/app/conf.php'); ?>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="<?=$paths['url']?><?=$paths['resources']['vendors']?>font-awesome-4.3.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="<?=$paths['url']?><?=$paths['resources']['css']?>normalize.css">
	<link rel="stylesheet" href="<?=$paths['url']?><?=$paths['resources']['css']?>styles.min.css">
</head>

<body>
	
	<div class="wrapper">
		<?php include_once($paths['data']['views'] . $pageID . '.php') ?>
	</div>
	
	<div class="script">
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>jquery/jquery.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>jquery/jquery.extensions.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>underscore/underscore.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>manager.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>functions.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>script.js"></script>
	</div>
</body>
</html>