<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/editor.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);
/**
 * $action
 * $templateID
 */

$editor = new editor();
$editor->id = $templateID;
$response;

switch ($action) {	
	case 'versions':
		$response = $editor->listVer();
	break;
}

echo json_encode($response);
?>