<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/conf.php');

class editor extends database{
	public $id;

	public function listVer () {
		$con = $this->DBConnect();
		
		$templateQuery = $con->prepare("SELECT * FROM `templates` WHERE id = ?");
		
		if( $templateQuery == false ){
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}
		
		$templateQuery->bind_param('i', $this->id);
		
		if( $templateQuery->execute() == false ){
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}
		
		$templateQuery->bind_result($ID, $title, $version, $active, $user, $colorPallet, $defaultColors);
		$templateData = array();
		
		while ( $templateQuery->fetch() ) {
			$templateData = array(
				'ID' => $ID, 
				'title' => $title, 
				'latestVersion' => $version, 
				'active' => $active, 
				'user' => $user, 
				'colorPallet' => $colorPallet, 
				'defaultColors' => json_decode($defaultColors),
			);
		}

		$revisions = scandir(SAVED_TEMPLATES . $this->id, 1);

		$templateData['versions'] = array();

		foreach ($revisions as $key => $value) {
			
			if ( $value == '.' || $value == '..') {
				continue;
			}

			$timeStamp = preg_replace('/(\.)\w+$/', '', $value);
			
			$templateData['versions'][] = array(
				'title' => date('m.d.y - h:i:s a', $timeStamp),
				'fileName' => $value,
			);
		}

		return $templateData;
	}
	
	public function validateFragment ($fragment){
		$fields = array(
			'fragment' => urlencode($fragment),
			'output' => urlencode('json'),
			'doctype' => urlencode('XHTML 1.0 Transitional'),
			'outline' => urlencode(1)
		);

		//url-ify the data for the POST
		$postString = '';
		foreach($fields as $key=>$value) { 
		    $postString .= $key.'='.$value.'&'; 
		}
		rtrim($postString, '&');

		//validate fragment
		return $this->w3Validate($postString);
	}

	private function w3Validate($postString){
		//initiate connection
		$ch = curl_init();
		// set url
		curl_setopt($ch, CURLOPT_URL, 'http://validator.w3.org/check');
		// return transfer
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		//count fields
		curl_setopt($ch, CURLOPT_POST, 4);
		//post fields
		curl_setopt($ch, CURLOPT_POSTFIELDS, $postString);
		//execute post
		$result = curl_exec($ch);
		//close connection
		curl_close($ch);

		return array(
			'success' => ( $result != false )? true : $result,
			'message' => $result
		);
	}

	public function saveFragment($fragment) {
		$time = time();
		$con = $this->DBConnect();

		// year, month, day, yymmdd
		$timeStamp = date('ymd', $time);

		// eventually change to include client name 
		if ( !file_exists( SAVED_TEMPLATES . $this->id ) ){
			mkdir( SAVED_TEMPLATES . $this->id );
		} 

		// create file name Unix timestamp
		$bodyFile = fopen( SAVED_TEMPLATES . $this->id . '/'. $time . '.html', "w");
		$writeSucces = fwrite($bodyFile, $fragment);

		fclose($bodyFile);
		
		if( $writeSucces == false){
			return array(
				'success' => false,
				'message' => error_get_last(),
			);
		}

		$updateVerison = $con->prepare("UPDATE `templates` SET version = ? WHERE id = ?;");
		
		if ( $updateVerison == false) {
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$updateVerison->bind_param('si', $time, $this->id);
		
		$time = $this->requestEscape($time, $con);
		
		$rowUpdated = $updateVerison->execute();

		return array(
			'title' => date('m.d.y - h:i:s', $time),
			'fileName' => $time,
			'success' => ( $rowUpdated !== false )? true : false,
		);
	}

	public function updateDefaultColors($colors){
		$con = $this->DBConnect();
		$colorsJson = json_encode($colors);
		
		$updateQuery = $con->prepare("UPDATE `templates` SET default_colors = ? WHERE id = ?;");
		
		if($updateQuery == false){
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$updateQuery->bind_param('si', $colorsJson, $this->id);
		$querySuccess = $updateQuery->execute();

		return array(
			'success' => ($querySuccess == false )? false : true,
			'message' => ($querySuccess == false )? $con->error : 'Colors Saved successfully.',
		);
	}
}