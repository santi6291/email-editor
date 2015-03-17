<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/editor/editor.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);
/**
 * $templateID
 */

$templateVer = new editor();
$templateVer->id = $templateID;

$verstions = $templateVer->listVer();

echo json_encode($verstions);