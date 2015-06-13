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
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>jqueryui/ui/minified/core.min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>jqueryui/ui/minified/widget.min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>jqueryui/ui/minified/mouse.min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>jqueryui/ui/minified/position.min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>jqueryui/ui/minified/draggable.min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>jqueryui/ui/minified/droppable.min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>underscore/underscore-min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['vendors']?>tooltipster/js/jquery.tooltipster.min.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>jquery.extensions.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>conf.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>manager.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>editor.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>functions.js"></script>
		<script src="<?=$paths['url']?><?=$paths['resources']['js']?>script.js"></script>
	</div>
</body>
</html>