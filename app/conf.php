<?php
//DEBUG MODE
ini_set('display_errors', 1);
error_reporting(E_ALL);

// SET PAGE ID
$pageID = ( $_SERVER['REQUEST_URI'] === '/' )? 'manager' : $_SERVER['REQUEST_URI'];
$pageID = preg_replace('/\?(.*$)/', '', $pageID);
$pageID = preg_replace('/(\/)/', '', $pageID);


// TIMEZONE
date_default_timezone_set("America/New_York");

// DATABASE CLASS
class database{

	// connect to DB
	public function DBConnect(){

		$db_host 	 = 'localhost';
		$db_user 	 = 'root';
		$db_password = 'sjsm1991';
		$db_name 	 = 'editor';

		$connection = new mysqli($db_host, $db_user, $db_password, $db_name);

		if ( $connection->connect_errno ) {

			return $connection->connect_error;
		} else {

			return $connection;
		}
	}

	// escape string for MySql
	public function requestEscape($escapeString, $connection = '') {

		if( $connection == '' ) {

			$connection = $this->DBConnect();	
		}

		if ( $escapedString = $connection->real_escape_string($escapeString) ) {

			return $escapedString;
		}

		return $connection->error;
	}
}
/*
app/
	handlers/
		template/
 	models/
 		template/
data/
	templates/	
resources/
	css/
	images/
	js/
	vendors/
*/
global $paths;
$paths = [
	'url' => $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['SERVER_NAME'] . '/',
	'app' => [
		'handlers' => [
			'template' => $_SERVER['DOCUMENT_ROOT'] . 'app/handlers/manager/',
		],
		'models' => [
			'template' => $_SERVER['DOCUMENT_ROOT'] . 'app/models/manager/',
		],
	],
	'data' => [
		'templates' => [
			'stored' => $_SERVER['DOCUMENT_ROOT'] . 'data/templates/stored/',
			'parts' => $_SERVER['DOCUMENT_ROOT'] . 'data/templates/parts/',
		],
		'views' => $_SERVER['DOCUMENT_ROOT'] . 'data/views/',
	],
	'resources' => [
		'styles' => 'resources/styles/',
		'images' => 'resources/images/',
		'js' => 'resources/js/',
		'vendors' => 'resources/vendors/',
	],
];