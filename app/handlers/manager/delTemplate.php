<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/manager/manager.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);
/**
 * EXTRACTED VARIABLE
 * $templateID
 * $action
 */

$removeTemplate = new manager();
$removeTemplate->ID = intval($templateID);

if ( $isActive == true ) {
	
	$templateRemoved = $removeTemplate->moveToTrash();
} else {

	$templateRemoved = $removeTemplate->delete();
}

echo json_encode($templateRemoved);