<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/app/conf.php');

class editor extends database{
	public $id;

	public function listVer () {
		$con = $this->DBConnect();
		
		$templateQuery = $con->prepare("SELECT * FROM `templates` WHERE template_id = ?");
		
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
		
		$templateQuery->bind_result($ID, $title, $version, $active, $defaultSettings, $colorPallet, $user);
		$templateData = array();
		
		while ( $templateQuery->fetch() ) {
			$templateData = array(
				'ID' => $ID, 
				'title' => $title, 
				'latestVersion' => $version, 
				'active' => $active, 
				'user' => $user, 
				'colorPallet' => json_encode($colorPallet), 
				'defaultSettings' => json_decode($defaultSettings),
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

		$updateVerison = $con->prepare("UPDATE `templates` SET version = ? WHERE template_id = ?;");
		
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

	public function updateSettings($settings){
		$con = $this->DBConnect();
		$settingsJson = json_encode($settings);
		
		$updateQuery = $con->prepare("UPDATE `templates` SET default_settings = ? WHERE template_id = ?;");
		
		if($updateQuery == false){
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$updateQuery->bind_param('si', $settingsJson, $this->id);
		$querySuccess = $updateQuery->execute();

		return array(
			'success' => ($querySuccess == false )? false : true,
			'message' => ($querySuccess == false )? $con->error : 'Settings Saved successfully.',
		);
	}

	public function getComponents(){

		$components = array(
			'template-body-content-cols-1' => array(
				'id' => 'template-body-content-cols-1',
				'title' => 'Single Column',
				'contents' => file_get_contents(VIEWS . 'template-body-content-cols-1.html'),
				'thumb' => RESOURCES . 'images/template-body-content-cols-1.png',
			),

			'template-body-content-cols-2'=> array(
				'id' => 'template-body-content-cols-2',
				'title' => '2 Columns',
				'contents' => file_get_contents(VIEWS . 'template-body-content-cols-2.html'),
				'thumb' => RESOURCES . 'images/template-body-content-cols-2.png',
			),

			'template-body-content-cols-3'=> array(
				'id' => 'template-body-content-cols-3',
				'title' => '3 Columns',
				'contents' => file_get_contents(VIEWS . 'template-body-content-cols-3.html'),
				'thumb' => RESOURCES . 'images/template-body-content-cols-3.png',
			),

			'template-body-content-cols-4'=> array(
				'id' => 'template-body-content-cols-4',
				'title' => '4 Columns',
				'contents' => file_get_contents(VIEWS . 'template-body-content-cols-4.html'),
				'thumb' => RESOURCES . 'images/template-body-content-cols-4.png',
			),

			'template-header-cols-1'=> array(
				'id' => 'template-header-cols-1',
				'title' => 'Image Only',
				'contents' => file_get_contents(VIEWS . 'template-header-cols-1.html'),
				'thumb' => RESOURCES . 'images/template-header-cols-1.png',
			),

			'template-header-cols-2-left'=> array(
				'id' => 'template-header-cols-2-left',
				'title' => 'Left image w/ text ',
				'contents' => file_get_contents(VIEWS . 'template-header-cols-2-left.html'),
				'thumb' => RESOURCES . 'images/template-header-cols-2-left.png',
			),

			'template-header-cols-2-right'=> array(
				'id' => 'template-header-cols-2-right',
				'title' => 'Right Image w/ text',
				'contents' => file_get_contents(VIEWS . 'template-header-cols-2-right.html'),
				'thumb' => RESOURCES . 'images/template-header-cols-2-right.png',
			),

			'template-header-cols-3'=> array(
				'id' => 'template-header-cols-3',
				'title' => 'Cented Image w/ text',
				'contents' => file_get_contents(VIEWS . 'template-header-cols-3.html'),
				'thumb' => RESOURCES . 'images/template-header-cols-3.png',
			),

			'template-layout-sidebar-left'=> array(
				'id' => 'template-layout-sidebar-left',
				'title' => 'Left sidebar, content right',
				'contents' => file_get_contents(VIEWS .'template-body-sidebar.html'),
				'thumb' => RESOURCES . 'images/template-layout-sidebar-left.png',
			),

			'template-layout-sidebar-right'=> array(
				'id' => 'template-layout-sidebar-right',
				'title' => 'Left content, right sidebar',
				'contents' => file_get_contents(VIEWS .'template-body-sidebar.html'),
				'thumb' => RESOURCES . 'images/template-layout-sidebar-right.png',
			),

			'template-layout-cols-3'=> array(
				'id' => 'template-layout-cols-3',
				'title' =>'Center content, two sidebars',
				'contents' => file_get_contents(VIEWS . 'template-body-sidebar.html'),
				'thumb' => RESOURCES . 'images/template-layout-cols-3.png',
			),

			'template-layout-single' => array(
				'id' => 'template-layout-single',
				'title' =>'Single column',
				'thumb' => RESOURCES . 'images/template-layout-single.png',
			),

			'editor-modify' => array(
				'id' => 'editor-modify',
				'contents' => file_get_contents(VIEWS . 'editor-modify.php'),
			),
			
			'editor-save' => array(
				'id' => 'editor-save',
				'contents' => file_get_contents(VIEWS . 'editor-save.php'),
			),
			
			'editor-defaults' => array(
				'id' => 'editor-defaults',
				'contents' => file_get_contents(VIEWS . 'editor-defaults.php'),
			),

			'template-head' => array(
				'id' => 'template-head',
				'contents' => file_get_contents(VIEWS . 'template-head.html'),
			),

			'template-footer' => array(
				'id' => 'template-footer',
				'contents' => file_get_contents(VIEWS . 'template-footer.html'),
			),

			'editor-revisions' => array(
				'id' => 'editor-revisions',
				'contents' => file_get_contents(VIEWS . 'editor-revisions.php'),
			),
			
			'editor-modify-component' => array(
				'id' => 'editor-modify-component',
				'contents' => file_get_contents(VIEWS . 'editor-modify-component.php'),
			)
		); //end components array
		
		return $components;
	}
}