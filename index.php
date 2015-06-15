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
	<div>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>jquery/dist/jquery.min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>underscore/underscore-min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>tooltipster/js/jquery.tooltipster.min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>handlebars/handlebars.js"></script>

		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>jquery.extensions.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>handlebars.helpers.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>manager.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>editor.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>script.js"></script>
	</div>
</body>
</html>