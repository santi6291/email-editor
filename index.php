<!DOCTYPE html>
<?php require_once($_SERVER['DOCUMENT_ROOT'] . '/app/conf.php'); ?>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="<?=$paths['url']?><?=$paths['resources']['styles']?>normalize.css">
	<link rel="stylesheet" href="<?=$paths['url']?><?=$paths['resources']['vendors']?>tooltipster/css/tooltipster.css">
	<link rel="stylesheet" href="<?=$paths['url']?><?=$paths['resources']['styles']?>styles.min.css">
</head>

<body>
	
	<div class="wrapper">
		<?php include_once($paths['data']['views'] . 'page-' . $pageID . '.php') ?>
	</div>
	
	<script src="/scripts.js"></script>	
</body>
</html>