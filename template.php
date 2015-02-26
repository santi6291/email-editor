<?php 
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/conf.php');

require_once ($paths['data']['templates']['parts'] . 'head.html');

require_once ($paths['data']['templates']['stored'] . $_GET['id'] . '/' . $_GET['version'] . '.html') ;

require_once ($paths['data']['templates']['parts'] . '/footer.html');