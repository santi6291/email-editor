<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/manager/manager.php');

$templateList = new manager();

$templates = $templateList->listTemplates();

echo json_encode($templates);
