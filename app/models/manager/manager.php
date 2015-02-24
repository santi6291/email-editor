<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/conf.php');

class manager extends database{
	public $ID;
	public $name;
	public $version;
	
	public function install() {
		global $paths;

		if ( file_exists($paths['data']['templates']['stored']) === false ) {
			
			if ( mkdir($paths['data']['templates']['stored']) === false ) {
				return [
					'success' => false,
					'message' => error_get_last(),
				];
				die();
			}
		}

		$con = $this->DBConnect(); 
		
		$templateQuery = $con->prepare("CREATE TABLE `templates` (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, title TINYTEXT NOT NULL, version TINYTEXT NOT NULL, active BOOLEAN NOT NULL DEFAULT 1);");
		
		if ( $templateQuery == false ) {
			return [
				'success' => false,
				'message' => $con->error,
			];
		}

		$templateSuccess = $templateQuery->execute();
		
		return [
			'success' => ( $templateSuccess === true )? true : false,
			'message' => ( $templateSuccess === true )? 'Table \'templates\' Created' : $con->error,
		];
		die();
	}

	public function uninstall (){
		global $paths;

		if ( count(scandir($paths['data']['templates']['stored'])) > 2) {
			if ( $this->destroy_dir($paths['data']['templates']['stored']) === false) {
				return [
					'success' => false,
					'message' => error_get_last(),
				];
				die();
			}
		}

		$con = $this->DBConnect();
		
		$dropTables = $con->prepare("DROP TABLE `templates`;");

		if ( $dropTables == false ) {
			return [
					'success' => false,
					'message' => $con->error,
				];
		}

		$tableDeleted = $dropTables->execute();

		return [
			'success' => ( $tableDeleted === true )? true : false,
			'message' => ( $tableDeleted === true )? 'Table \'templates\' Dropped' : $con->error,
		];
		die();
	}

	public function newTemp ($makeVerFile = true){
		global $paths;
		//check if template name taken 
		$templateTaken = $this->validate();
		
		// return $templateTaken;
		if ( $templateTaken == true ) {
			return [
				'success' => false,
				'message' => 'Template Name Taken',
			];
			die();
		}
		
		// file give current time for version control
		$this->version = time();

		$con = $this->DBConnect();
		// insert template name and time-stamp as first version
		$newTemplate = $con->prepare("INSERT INTO `templates` (title, version) VALUES (?, ?);");
		
		if ( $newTemplate == false ) {

			return [
				'success' => false,
				'message' => $con->error,
			];
			die();
		}

		$newTemplate->bind_param('ss', $this->name, $this->version);
		
		$this->name = $this->requestEscape($this->name);

		$templateCreated = $newTemplate->execute();

		if ( $templateCreated == false ) {
			return [
				'success' => false,
				'message' => $con->error,
			];
			die();
		}

		$this->ID = $con->insert_id;

		// check if folder name taken
		if ( file_exists($paths['data']['templates']['stored'] . $this->ID) == true ){
			return [
				'success' => false,
				'message' => error_get_last(),
			];
			die();
		}

		// make dir with provide name
		if ( mkdir($paths['data']['templates']['stored'] . $this->ID) == false ) {
			return[
				'success' => false,
				'message' => error_get_last(),
			];
			die();
		}

		// return if no blank template file is to be made
		if ( $makeVerFile == false ) {
			return true;
			die();
		}

		// copy template body, to template folder, with timestamp
		if ( copy($paths['data']['templates']['parts'] . 'new.html', $paths['data']['templates']['stored'] . $this->ID . '/' . $this->version . '.html') ) {
			
			return [
				'success' => true,
				'ID'      => $this->ID,
				'title'   => $this->name,
				'version' => $this->version,
				'active'  => true,
			];
			die();
		}
	}

	public function cloneTemp ( $orgTemplateID ) {
		global $paths;
		
		// $paths['data']['templates']['stored'] = $_SERVER['DOCUMENT_ROOT'] . 'app/templates/';

		$createTemp = $this->newTemp(false);		
		
		if ( $createTemp !== true ) {
			return $createTemp;
			die();
		}
		//get all version of template to be copied
		$orgTempVer = scandir($paths['data']['templates']['stored'] . $orgTemplateID, 1);
		
		if ( $orgTempVer == false) {
			return false;
			die();
		}
		
		// get latest version from original template
		$orgLatestVer = '/' . $orgTempVer[0];

		// copy to new direcotry
		if ( copy($paths['data']['templates']['stored'] . $orgTemplateID . $orgLatestVer, $paths['data']['templates']['stored'] . $this->ID . '/' . $this->version .'.html') == false) {
			return array(
				'success' => false,
				'message' => error_get_last(),
			);
			die();
		}

		return array(
			'success' => true,
			'ID'      => $this->ID,
			'title'   => $this->name,
			'version' => $this->version,
			'active'  => true,
		);
		die();
	}
	
	public function moveToTrash () {
		$con = $this->DBConnect();
		
		$updateRow = $con->prepare("UPDATE `templates` SET active = ? WHERE id = ?;");
		if ( $updateRow == false) {
			return array(
				'success' => false,
				'message' => $con->error,
			);
			die();
		}

		$updateRow->bind_param('ii', 0, $this->ID);
		$rowUpdated = $updateRow->execute();

		return array(
			'success' => ( $rowUpdated === true )? true : false,
			'message' => ( $rowUpdated === true )? '' : $con->error,
			'function' => 'execute',
		);
		die();
	}

	public function delete () {
		global $paths;
		
		if ( $this->destroy_dir( $paths['data']['templates']['stored'] . $this->ID) == false) {
			return array(
				'success' => false,
				'message' => error_get_last(),
			);
		}

		$con = $this->DBConnect();

		// delete folder with template files
		$delTemplate = $con->prepare("DELETE FROM `templates` WHERE id = ?");
		
		if ( $delTemplate == false ) {
			return array(
				'success' => false,
				'message' => $con->error,
			);
			die();
		}

		$delTemplate->bind_param('i', $this->ID);
		$delTemplate->execute();

		return array(
			'success' => ( $delTemplate === true )? true : false,
			'message' => ( $delTemplate === true )? '' : $con->error,
		);
		die();
	}

	public function listTemplates () {
		$con = $this->DBConnect();

		$listRows = $con->prepare("SELECT * FROM `templates`");

		if ( $listRows !== false) {
			$listRows->execute();
			$listRows->bind_result($ID, $title, $version, $active);
			
			$templateList = array();
			
			while ( $listRows->fetch() ) {
				$templateList[$ID] = array(
					'ID'      => $ID,
					'title'   => $title,
					'version' => $version,
					'active'  => ( $active == 1 )? true : false,
				);
			}

			return $templateList;
		}
	}

	private function validate() {
		
		$templateExist = false;

		// get all existing templates
		$templateList = $this->listTemplates();

		// loop to check for match if any
		foreach ( $templateList as $key => $template ) {

			if ( $template['title'] == $this->name ) {
				$templateExist =  true;
				break;
				return;
			}
		}
		return $templateExist;
	}

	/*private function folderID ($ID){
		return str_pad($ID, 3 , '0', STR_PAD_LEFT);
	}*/
	
	private function destroy_dir($dir) { 
	    
		if ( !is_dir($dir) || is_link($dir) ) {
			return unlink($dir);
		}; 
	    
	    foreach (scandir($dir) as $file) { 
	        // skip . and .. in array
	        if ($file == '.' || $file == '..') continue; 
	        
	        if ( !$this->destroy_dir($dir . DIRECTORY_SEPARATOR . $file) ) { 
	            chmod($dir . DIRECTORY_SEPARATOR . $file, 0777); 

	            if ( !$this->destroy_dir($dir . DIRECTORY_SEPARATOR . $file) ) return false; 
	        }; 
	    } 
	    return rmdir($dir); 
	}
}