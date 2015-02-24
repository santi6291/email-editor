<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/manager/manager.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);
/**
 * EXTRACTED VARIABLE
 * $templateName
 */

$createTemplate = new manager();
$createTemplate->name = $templateName;
// if any errors return as JSON in $templateCreated
error_reporting(0);
$templateCreated = $createTemplate->newTemp();

echo json_encode($templateCreated);
