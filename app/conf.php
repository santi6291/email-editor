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
		$db_name 	 = 'editor';
		
		// include variables 
		// $db_user
		// $db_password
		include 'DB.php';

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

// PATHS
define('URL', $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['SERVER_NAME'] . '/');
define('MANGER_HANDLERS', $_SERVER['DOCUMENT_ROOT'] . 'app/handlers/manager/');
define('MANAGER_MODEL', $_SERVER['DOCUMENT_ROOT'] . 'app/models/manager/');
define('SAVED_TEMPLATES', $_SERVER['DOCUMENT_ROOT'] . 'data/templates/');
define('VIEWS', $_SERVER['DOCUMENT_ROOT'] . 'data/views/');
define('RESOURCES', URL . 'resources/');