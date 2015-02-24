<?php
//debug mode
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Timezone
date_default_timezone_set("America/New_York");

// Database class
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
	],
	'resources' => [
		'css' => 'resources/css/',
		'images' => 'resources/images/',
		'js' => 'resources/js/',
		'vendors' => 'resources/vendors/',
	],
];