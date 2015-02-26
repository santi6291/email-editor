<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/manager/manager.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);
/**
 * EXTRACTED VARIABLE
 * $templateID
 * $newName
 */

$updatetemplate = new manager();
$updatetemplate->ID = intval($templateID);

$templateUpdated = $updatetemplate->update($newName);

echo json_encode($templateUpdated);
