<?php 
require_once (VIEWS . 'template-head.html');
require_once (SAVED_TEMPLATES . $_GET['id'] . '/' . $_GET['version'] . '.html');
require_once (VIEWS . '/template-footer.html'); 
?>