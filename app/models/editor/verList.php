<?php
include_once('classes.php');

$revisions = scandir($_SERVER['DOCUMENT_ROOT'] . '/blast/revisions/', 1);

$response = array();

foreach ($revisions as $key => $value) {
	
	if ( strpos($value, '.php') !== FALSE ) {
		$time = str_replace('.php', '', $value);
		
		$response[] = array(
			'title' => date('m.d.y - h:i:s', $time),
			'fileName' => $value,
		);
	}
}

echo json_encode($response);