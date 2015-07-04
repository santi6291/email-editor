<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/manager.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);

/**
 * EXTRACTED VARIABLE
 * $action
 * $templateName
 * $templateID
 * $isActive
 * $newTempName
 * $cloneID
 * $newName
 */
$response;
$manager = new manager();

switch ($action) {	
	case 'install':
		error_reporting(0);
		$response = $manager->install();
	break;
	
	case 'uninstall':
		error_reporting(0);
		$response = $manager->uninstall();
	break;

	case 'new':
		$manager->name = $templateName;
		error_reporting(0);
		$response = $manager->newTemp();
	break;
	
	case 'update':
		$manager->ID = intval($templateID);
		$response = $manager->update($newName);
	break;
	
	case 'list':
		$response = $manager->listTemplates();
	break;

	case 'clone':
		$manager->name = $newTempName;
		error_reporting(0);
		$response = $manager->cloneTemp( $cloneID );
	break;

	case 'delete':
		$manager->ID = intval($templateID);
		$isActiveBool = ( $isActive == 'true' )? true : false;

		if ( $isActiveBool ) {
			$templateRemoved = $manager->moveToTrash();
		} else {
			$templateRemoved = $manager->delete();
		}

		$response = $templateRemoved;
	break;
	case 'getComponents':
		$response = $manager->getComponents();
	break;
}
echo json_encode($response);
?>