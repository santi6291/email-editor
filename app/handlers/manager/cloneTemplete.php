<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/manager/manager.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);
/**
 * EXTRACTED VARIABLE
 * $newTempName
 * $cloneID
 */
$cloneTempalte = new manager();
$cloneTempalte->name = $newTempName;

// if any errors return as JSON in $templateCreated
error_reporting(0);
$templateCloned = $cloneTempalte->cloneTemp( $cloneID );

echo json_encode($templateCloned);