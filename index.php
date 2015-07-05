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
	<title>
		<?php 
			if ( isset($_GET['template']) ) {
				echo 'Template: ' .  $_GET['template'];
			} else {
				echo 'Template Manager';
			}
		?>
	</title>
	
	<link rel="stylesheet" href="<?php echo RESOURCES ?>styles/styles.min.css">
</head>

<body>
	<div class="wrapper">
		<?php include_once(VIEWS . 'page-' . $pageID . '.php') ?>
	</div>

	<div>
		<script src="<?php echo RESOURCES ?>vendors/jquery/dist/jquery.min.js"></script>
		<script src="<?php echo RESOURCES ?>vendors/underscore/underscore-min.js"></script>
		<script src="<?php echo RESOURCES ?>vendors/tooltipster/js/jquery.tooltipster.min.js"></script>
		<script src="<?php echo RESOURCES ?>vendors/handlebars/handlebars.js"></script>
		<script src="<?php echo RESOURCES ?>vendors/spectrum/spectrum.js"></script>
		<script src="<?php echo RESOURCES ?>vendors/bootstrap/dist/js/bootstrap.min.js"></script>

		<script src="<?php echo RESOURCES ?>js/jquery.extensions.js"></script>
		<script src="<?php echo RESOURCES ?>js/handlebars.helpers.js"></script>
		<script src="<?php echo RESOURCES ?>js/manager.js"></script>
		<script src="<?php echo RESOURCES ?>js/editor.js"></script>
		<script src="<?php echo RESOURCES ?>js/script.js"></script>
	</div>
</body>
</html>
<?php endif; ?>