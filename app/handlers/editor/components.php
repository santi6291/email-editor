<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/models/editor/editor.php');

if ( isset($_POST) ) extract($_POST);
if ( isset($_GET) ) extract($_GET);

$EditorComponents = new editor();

$components = $EditorComponents->components();

echo json_encode($components);