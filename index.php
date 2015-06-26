<!DOCTYPE html>
<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/app/conf.php');

if ( $pageID == 'template' ):
	include_once(VIEWS . 'page-' . $pageID . '.php');
else:
?>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="<?= RESOURCES ?>vendors/tooltipster/css/tooltipster.css">
	<link rel="stylesheet" href="<?= RESOURCES ?>styles/styles.min.css">
</head>

<body>
	<div class="wrapper">
		<?php include_once(VIEWS . 'page-' . $pageID . '.php') ?>
	</div>

	<div>
		<script src="<?= RESOURCES ?>vendors/jquery/dist/jquery.min.js"></script>
		<script src="<?= RESOURCES ?>vendors/underscore/underscore-min.js"></script>
		<script src="<?= RESOURCES ?>vendors/tooltipster/js/jquery.tooltipster.min.js"></script>
		<script src="<?= RESOURCES ?>vendors/handlebars/handlebars.js"></script>

		<script src="<?= RESOURCES ?>js/jquery.extensions.js"></script>
		<script src="<?= RESOURCES ?>js/handlebars.helpers.js"></script>
		<script src="<?= RESOURCES ?>js/manager.js"></script>
		<script src="<?= RESOURCES ?>js/editor.js"></script>
		<script src="<?= RESOURCES ?>js/script.js"></script>
	</div>
</body>
</html>
<?php endif; ?>