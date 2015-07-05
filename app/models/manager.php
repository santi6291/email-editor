<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/app/conf.php');

class manager extends database{
	public $ID;
	public $name;
	public $version;
	
	// CREATE 'template' TABLE
	public function install() {

		if ( file_exists(SAVED_TEMPLATES) === false ) {
			
			if ( mkdir(SAVED_TEMPLATES) === false ) {
				return array(
					'success' => false,
					'message' => error_get_last(),
				);
			}
		}

		$con = $this->DBConnect(); 

		$templateQuery = $con->prepare("CREATE TABLE `templates` (
			template_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
			title TINYTEXT NOT NULL,
			version TINYTEXT NOT NULL,
			active BOOLEAN NOT NULL DEFAULT 1,
			default_settings TEXT,
			color_pallet TEXT,
			users_id Int);"
		);
		
		$usersQuery = $con->prepare("CREATE TABLE `users` (
			user_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
			username TEXT NOT NULL,
			display_name TEXT NOT NULL,
			password TEXT NOT NULL);"
		);
		
		if ( ($templateQuery == false) || ($usersQuery == false) ) {
			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$templateSuccess = $templateQuery->execute();
		$userSuccess = $usersQuery->execute();
		
		return array(
			'success' => ( ($templateSuccess === true) || ($userSuccess === true) )? true : false,
			'message' => ( ($templateSuccess === true) || ($userSuccess === true) )? 'Table \'templates\' and  \'users\' Created' : $con->error,
		);
	}
	
	// DROP 'template' TABLE
	public function uninstall (){

		if ( count(scandir(SAVED_TEMPLATES)) > 2) {
			if ( $this->destroy_dir(SAVED_TEMPLATES) === false) {
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
		
		$defaultSettings = array(
			'paragraph' => array(
				'color' => '#505050',
				'line-height' => '150',
				'font-size' => '14',
			),
			'bold' => array(
				'color' => '#505050',
				'line-height' => '150',
			),
			'italic' => array(
				'color' => '#505050',
				'line-height' => '150',
			),
			'strikethrough' => array(
				'color' => '#505050',
				'line-height' => '150',
			),
			'subscript' => array(
				'color' => '#505050',
				'line-height' => '150',
			),
			'superscript' => array(
				'color' => '#505050',
				'line-height' => '150',
			),
			'anchor' => array(
				'color' => '#0000EE',
				'line-height' => '150',
			),
			'heading1' => array(
				'color' => '#202020',
				'line-height' => '100',
				'font-size' => '34',
			),
			'heading2' => array(
				'color' => '#202020',
				'line-height' => '100',
				'font-size' => '16',
			),
			'heading3' => array(
				'color' => '#202020',
				'line-height' => '100',
				'font-size' => '16',
			),
			'heading4' => array(
				'color' => '#202020',
				'line-height' => '100',
				'font-size' => '14',
			),
			'heading5' => array(
				'color' => '#202020',
				'line-height' => '100',
				'font-size' => '12',
			),
			'backgroundTable' => array(
				'background-color' => '#fafafa'
			),
			'templateContainer' => array(
				'background-color' => '#fff'
			),
		);

		$jsonSettings = json_encode($defaultSettings);

		$con = $this->DBConnect();
		// insert template name and time-stamp as first version
		$newTemplate = $con->prepare("INSERT INTO `templates` (title, version, default_settings) VALUES (?, ?, ?);");

		if ( $newTemplate == false ) {

			return array(
				'success' => false,
				'message' => $con->error,
			);
		}

		$newTemplate->bind_param('sss', $this->name, $this->version, $jsonSettings);
		
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
		if ( file_exists(SAVED_TEMPLATES . $this->ID) == true ){
			return array(
				'success' => false,
				'message' => error_get_last(),
			);
		}

		// make dir with provide name
		if ( mkdir(SAVED_TEMPLATES . $this->ID) == false ) {
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
		if ( copy(VIEWS . 'template-new.html', SAVED_TEMPLATES . $this->ID . '/' . $this->version . '.html') ) {
			
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

		$createTemp = $this->newTemp(false);		
		
		if ( $createTemp !== true ) {
			return $createTemp;
		}
		//get all version of template to be copied
		$orgTempVer = scandir(SAVED_TEMPLATES . $orgTemplateID, 1);
		
		if ( $orgTempVer == false) {
			return array(
				'folderID' => SAVED_TEMPLATES . $orgTemplateID,
				'success' => false,
				'message' => error_get_last(),
			);
		}
		
		// get latest version from original template
		$orgLatestVer = '/' . $orgTempVer[0];

		// copy to new direcotry
		if ( copy(SAVED_TEMPLATES . $orgTemplateID . $orgLatestVer, SAVED_TEMPLATES . $this->ID . '/' . $this->version .'.html') == false) {
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
		
		$updateRow = $con->prepare("UPDATE `templates` SET active = 0 WHERE template_id = ?;");
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
		
		if ( $this->destroy_dir( SAVED_TEMPLATES . $this->ID) == false) {
			return array(
				'success' => false,
				'message' => error_get_last(),
			);
		}

		$con = $this->DBConnect();

		// delete folder with template files
		$delTemplate = $con->prepare("DELETE FROM `templates` WHERE template_id = ?");
		
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
		
		$updateRow = $con->prepare("UPDATE `templates` SET title = ? WHERE template_id = ?;");
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
			$listRows->bind_result($ID, $title, $version, $active, $defaultSettings, $colorPallet, $user);
			$templateList = array();
			
			while ( $listRows->fetch() ) {
				$templateList[$ID] = array(
					'ID'          => $ID,
					'title'       => $title,
					'version'     => $version,
					'active'      => ( $active == 1 )? true : false,
					'user'        => $user,
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

	public function getComponents(){

		$components = array(
			'manager-listing' => array(
				'id' => 'manager-listing',
				'contents' => file_get_contents(VIEWS . 'manager-listing.php'),
			),
			'manager-template-action' => array(
				'id' => 'manager-template-action',
				'contents' => file_get_contents(VIEWS . 'manager-template-action.php'),
			),
			'bootstrap-modal' => array(
				'id' => 'bootstrap-modal',
				'contents' => file_get_contents(VIEWS . 'bootstrap-modal.php'),
			),
			'manager-template-delete' => array(
				'id' => 'manager-template-delete',
				'contents' => file_get_contents(VIEWS . 'manager-template-delete.php'),
			),
		); //end components array
		
		return $components;
	}
}