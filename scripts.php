<?php 
$vendors = $_SERVER['DOCUMENT_ROOT'] . '/resources/vendors/';
$resources = $_SERVER['DOCUMENT_ROOT'] . '/resources/js/';
header('HTTP/1.1 200 OK');
header('Content-Type: application/javascript');

echo "\n //jQuery \n";
require_once $vendors . 'jquery/dist/jquery.min.js';
echo "\n //jQuery UI\n";
require_once $vendors . 'jqueryui/jquery-ui.js';
echo "\n //underscore \n";
require_once $vendors . 'underscore/underscore-min.js';
echo "\n //jquery.tooltipster \n";
require_once $vendors . 'tooltipster/js/jquery.tooltipster.min.js';
echo "\n";
require_once $resources . 'jquery.extensions.js';
echo "\n";
require_once $resources . 'manager.js';
echo "\n";
require_once $resources . 'editor.js';
echo "\n";
require_once $resources . 'functions.js';
echo "\n";
require_once $resources . 'script.js';