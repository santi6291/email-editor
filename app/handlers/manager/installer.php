<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/manager/manager.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);
/**
 * EXTRACTED VARIABLE
 * $action
 */

$installer = new manager();

// if any errors return as JSON in $templateCreated
error_reporting(0);
if ( $action == 'install') {
	
	$tableExecute = $installer->install();
} else {

	$tableExecute = $installer->uninstall();
}

echo json_encode($tableExecute);