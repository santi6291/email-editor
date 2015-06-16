<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/conf.php');

class editor extends database{
	public $id;

	public function listVer () {
		global $paths;

		$revisions = scandir($paths['data']['templates'] . $this->id, 1);

		$response = array();

		foreach ($revisions as $key => $value) {
			
			if ( $value == '.' || $value == '..') {
				continue;
			}

			$timeStamp = preg_replace('/(\.)\w+$/', '', $value);
			
			$response[] = array(
				'title' => date('m.d.y - h:i:s a', $timeStamp),
				'fileName' => $value,
			);
		}

		return $response;
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
		//connection time out
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
		//user agent
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36');
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
		global $paths;
		$time = time();
		$con = $this->DBConnect();

		// year, month, day, yymmdd
		$timeStamp = date('ymd', $time);

		// eventually change to include client name 
		if ( !file_exists( $paths['data']['templates'] . $this->id ) ){
			mkdir( $paths['data']['templates'] . $this->id );
		} 

		// create file name Unix timestamp
		$bodyFile = fopen( $paths['data']['templates'] . $this->id . '/'. $time . '.html', "w");
		$writeSucces = fwrite($bodyFile, $fragment);

		fclose($bodyFile);
		
		if( $writeSucces == false){
			return array(
				'success' => false,
				'message' => error_get_last(),
			);
			die();
		}

		$updateVerison = $con->prepare("UPDATE `templates` SET version = ? WHERE id = ?;");
		
		if ( $updateVerison == false) {
			return array(
				'success' => false,
				'message' => $con->error,
			);
			die();
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
}