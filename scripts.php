<?php 
$vendors = $_SERVER['DOCUMENT_ROOT'] . '/resources/vendors/';
$resources = $_SERVER['DOCUMENT_ROOT'] . '/resources/js/';
header('HTTP/1.1 200 OK');
header('Content-Type: application/javascript');
$script = [
	file_get_contents($vendors . 'jquery/dist/jquery.min.js'),
	// full jQuery UI
	// file_get_contents($vendors . 'jqueryui/jquery-ui.min.js'),
	// jquery Draggable, Drappable
	file_get_contents($vendors . 'jqueryui/ui/minified/core.min.js'),
	file_get_contents($vendors . 'jqueryui/ui/minified/widget.min.js'),
	file_get_contents($vendors . 'jqueryui/ui/minified/mouse.min.js'),
	file_get_contents($vendors . 'jqueryui/ui/minified/position.min.js'),
	file_get_contents($vendors . 'jqueryui/ui/minified/draggable.min.js'),
	file_get_contents($vendors . 'jqueryui/ui/minified/droppable.min.js'),
	file_get_contents($vendors . 'underscore/underscore-min.js'),
	file_get_contents($vendors . 'tooltipster/js/jquery.tooltipster.min.js'),
	file_get_contents($resources . 'jquery.extensions.js'),
	file_get_contents($resources . 'conf.js'),
	file_get_contents($resources . 'manager.js'),
	file_get_contents($resources . 'editor.js'),
	file_get_contents($resources . 'functions.js'),
	file_get_contents($resources . 'script.js'),
];
$script = implode("\n", $script);
// $script = preg_replace("/(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:)\/\/.*))/", "", $script);
// $script = preg_replace('/\s+/', '', $script);
echo $script;
?>