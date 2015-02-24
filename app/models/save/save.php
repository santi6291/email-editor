<?php
include_once('classes.php');

$time = time();
// year, month, day, yymmdd
$timeStamp = date('ymd', $time);

// eventually change to include client name 
if ( !file_exists('/home/berman/public_html/emailTemplates/_editor/blast/revisions/') ){
	mkdir('/home/berman/public_html/emailTemplates/_editor/blast/revisions/');
} 

// create file name Unix timestamp
$bodyFile = fopen('/home/berman/public_html/emailTemplates/_editor/blast/revisions/' . $time . '.php', "w");
$writeSucces = fwrite($bodyFile, $_POST['content']);

$response = array(
	'title' => date('m.d.y - h:i:s', $time),
	'fileName' => $time,
	'success' => ( $writeSucces !== FALSE )? TRUE : FALSE,
);
fclose($bodyFile);
echo json_encode($response);