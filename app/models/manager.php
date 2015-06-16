<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/conf.php');

class manager extends database{
	public $ID;
	public $name;
	public $version;
	
	// CREATE 'template' TABLE
	public function install() {
		global $paths;

		if ( file_exists($paths['data']['templates']) === false ) {
			
			if ( mkdir($paths['data']['templates']) === false ) {
				return array(
					'success' => false,
					'message' => error_get_last(),
				);
			}
		}

		$con = $this->DBConnect(); 
		
		$templateQuery = $con->prepare("CREATE TABLE `templates` (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, title TINYTEXT NOT NULL, version TINYTEXT NOT NULL, active BOOLEAN NOT NULL DEFAULT 1, user Int, colorPallet MEDIUMBLOB);");
		$usersQuery    = $con->prepare("CREATE TABLE `users` (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, username TEXT NOT NULL, displayname TEXT NOT NULL, password TEXT NOT NULL);");
		
		if ( $templateQuery == false || $usersQuery == false) {
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$templateSuccess = $templateQuery->execute();
		$userSuccess = $usersQuery->execute();
		
		return array(
			'success' => ( $templateSuccess === true || $userSuccess === true )? true : false,
			'message' => ( $templateSuccess === true || $userSuccess === true )? 'Table \'templates\' and  \'users\' Created' : $con->error,
		);
	}
	
	// DROP 'template' TABLE
	public function uninstall (){
		global $paths;

		if ( count(scandir($paths['data']['templates'])) > 2) {
			if ( $this->destroy_dir($paths['data']['templates']) === false) {
				return array(
					'success' => false,
					'message' => error_get_last(),
				);
			}
		}

		$con = $this->DBConnect();
		
		$dropTables = $con->prepare("DROP TABLE `templates`, `users`;");

		if ( $dropTables == false ) {
			return array(
					'success' => false,
					'message' => $con->error,
				);
		}

		$tableDeleted = $dropTables->execute();

		return array(
			'success' => ( $tableDeleted === true )? true : false,
			'message' => ( $tableDeleted === true )? 'Table \'templates\' and \'users\' Dropped' : $con->error,
		);
	}

	//INSERT NEW TEMPLATE DATA TO 'templates' TABLE
	public function newTemp ($makeVerFile = true){
		global $paths;
		//check if template name taken 
		$templateTaken = $this->validate();
		
		// return $templateTaken;
		if ( $templateTaken == true ) {
			return array(
				'success' => false,
				'message' => 'Template Name Taken',
			);
		}
		
		// file give current time for version control
		$this->version = time();

		$con = $this->DBConnect();
		// insert template name and time-stamp as first version
		$newTemplate = $con->prepare("INSERT INTO `templates` (title, version) VALUES (?, ?);");
		
		if ( $newTemplate == false ) {

			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$newTemplate->bind_param('ss', $this->name, $this->version);
		
		$this->name = $this->requestEscape($this->name, $con);

		$templateCreated = $newTemplate->execute();

		if ( $templateCreated == false ) {
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$this->ID = $con->insert_id;

		// check if folder name taken
		if ( file_exists($paths['data']['templates'] . $this->ID) == true ){
			return array(
				'success' => false,
				'message' => error_get_last(),
			);
		}

		// make dir with provide name
		if ( mkdir($paths['data']['templates'] . $this->ID) == false ) {
			return array(
				'success' => false,
				'message' => error_get_last(),
			);
		}

		// return if no blank template file is to be made
		if ( $makeVerFile == false ) {
			return true;
		}

		// copy template body, to template folder, with timestamp
		if ( copy($paths['data']['views'] . 'template-new.html', $paths['data']['templates'] . $this->ID . '/' . $this->version . '.html') ) {
			
			return array(
				'success' => true,
				'ID'      => $this->ID,
				'title'   => $this->name,
				'version' => $this->version,
				'active'  => true,
			);
		}
	}

	// CLONE EXISTING TEMPLATE
	public function cloneTemp ( $orgTemplateID ) {
		global $paths;

		$createTemp = $this->newTemp(false);		
		
		if ( $createTemp !== true ) {
			return $createTemp;
		}
		//get all version of template to be copied
		$orgTempVer = scandir($paths['data']['templates'] . $orgTemplateID, 1);
		
		if ( $orgTempVer == false) {
			return array(
				'folderID' => $paths['data']['templates'] . $orgTemplateID,
				'success' => false,
				'message' => error_get_last(),
			);
		}
		
		// get latest version from original template
		$orgLatestVer = '/' . $orgTempVer[0];

		// copy to new direcotry
		if ( copy($paths['data']['templates'] . $orgTemplateID . $orgLatestVer, $paths['data']['templates'] . $this->ID . '/' . $this->version .'.html') == false) {
			return array(
				'success' => false,
				'message' => error_get_last(),
			);
		}

		return array(
			'success' => true,
			'ID'      => $this->ID,
			'title'   => $this->name,
			'version' => $this->version,
			'active'  => true,
		);
	}
	
	// REMOVE TEMPLATE FROM ACTIVE LIST
	public function moveToTrash () {
		$con = $this->DBConnect();
		
		$updateRow = $con->prepare("UPDATE `templates` SET active = 0 WHERE id = ?;");
		if ( $updateRow == false) {
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$updateRow->bind_param('i', $this->ID);
		$rowUpdated = $updateRow->execute();

		return array(
			'success' => ( $rowUpdated === true )? true : false,
			'message' => ( $rowUpdated === true )? 'moveToTrash' : $con->error,
		);
	}

	// DELETE ROW FROM DB, DESTORY TEMPLTE DIRECTORY
	public function delete () {
		global $paths;
		
		if ( $this->destroy_dir( $paths['data']['templates'] . $this->ID) == false) {
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
		}

		$delTemplate->bind_param('i', $this->ID);
		$templateDeleted = $delTemplate->execute();

		return array(
			'success' => ( $templateDeleted === true )? true : false,
			'message' => ( $templateDeleted === true )? '' : $con->error,
		);
	}

	// UPDATE TEMPLATE NAME
	public function update ($newName) {
		$con = $this->DBConnect();
		
		$updateRow = $con->prepare("UPDATE `templates` SET title = ? WHERE id = ?;");
		if ( $updateRow == false) {
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$updateRow->bind_param('si', $newName, $this->ID);
		
		$newName = $this->requestEscape($newName, $con);
		
		$rowUpdated = $updateRow->execute();

		return array(
			'success' => ( $rowUpdated === true )? true : false,
			'message' => ( $rowUpdated === true )? '' : $con->error,
		);
	}

	// RETURN EXISTING TEMPLATES
	public function listTemplates () {
		$con = $this->DBConnect();

		$listRows = $con->prepare("SELECT * FROM `templates`");

		if ( $listRows !== false) {
			$listRows->execute();
			$listRows->bind_result($ID, $title, $version, $active, $user, $colorPallet);
			
			$templateList = [];
			
			while ( $listRows->fetch() ) {
				$templateList[$ID] = array(
					'ID'          => $ID,
					'title'       => $title,
					'version'     => $version,
					'active'      => ( $active == 1 )? true : false,
					"user"        => $user,
					"colorPallet" => $colorPallet,
				);
			}
			return $templateList;
		}
	}

	// CHECK IF TEMPALTE NAME IS TAKEN
	private function validate() {
		
		$templateExist = false;

		// get all existing templates
		$templateList = $this->listTemplates();

		// loop to check for match if any
		foreach ( $templateList as $key => $template ) {

			if ( $template['title'] == $this->name ) {
				$templateExist =  true;
				break;
			}
		}
		return $templateExist;
	}
	
	// RECURSIVELY DESTROY DIRECTORY AND FILES
	private function destroy_dir($dir) { 
	    
		if ( !is_dir($dir) || is_link($dir) ) {
			return unlink($dir);
		}; 
	    
	    foreach (scandir($dir) as $file) { 
	        // skip . and .. in array
	        if ($file == '.' || $file == '..') {
	        	continue;
	        }; 
	        
	        if ( !$this->destroy_dir($dir . DIRECTORY_SEPARATOR . $file) ) { 
	            chmod($dir . DIRECTORY_SEPARATOR . $file, 0777); 

	            if ( !$this->destroy_dir($dir . DIRECTORY_SEPARATOR . $file) ) {
	            	
	            	return false;
	            };
	        }; 
	    }
	    
	    return rmdir($dir); 
	}
}