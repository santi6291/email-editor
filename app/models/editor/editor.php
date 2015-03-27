<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/conf.php');

class editor extends database{
	public $id;

	public function listVer () {
		global $paths;

		$revisions = scandir($paths['data']['templates']['stored'] . $this->id, 1);

		$response = [];

		foreach ($revisions as $key => $value) {
			
			if ( $value == '.' || $value == '..') {
				continue;
			}

			$timeStamp = preg_replace('/(\.)\w+$/', '', $value);
			
			$response[] = [
				'title' => date('m.d.y - h:i:s a', $timeStamp),
				'fileName' => $value,
			];
		}

		return $response;
	}

	public function components (){
		global $paths;

		$componentsDir = scandir($paths['data']['templates']['parts'] . 'components/');
		$componets = array_filter($componentsDir, function($value){
			return strpos($value, '.html') !== false;
		});

		$componetsArr = [];

		foreach ($componets as $key => $component) {
			$componentTitle = preg_replace('/(\.)\w+$/', '', $component);
			$componentContent = file_get_contents($paths['data']['templates']['parts'] . 'components/' . $component);
			
			$componetsArr[$componentTitle] = [
				'title'    => $componentTitle,
				'fileName' => $component,
				'content'  => $componentContent,
			];
		}

		return $componetsArr;
	}
}