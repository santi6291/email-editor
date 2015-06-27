<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/editor.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);
/**
 * $action
 * $templateID
 * $fragment
 */

$editor = new editor();
$response;

switch ($action) {	
	case 'versions':
		$editor->id = $templateID;
		$response = $editor->listVer();
	break;

	case 'validate':
		$response = $editor->validateFragment($fragment);
	break;

	case 'save':
		$editor->id = $templateID;
		$response = $editor->saveFragment($fragment);
	break;
	case 'updateDefaultColors':
		$editor->id = $templateID;
		$response = $editor->updateDefaultColors($colors);
	break;
}

echo json_encode($response);
?>