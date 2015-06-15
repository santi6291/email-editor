<?php
require_once($_SERVER['DOCUMENT_ROOT'] . 'app/conf.php');

class editor extends database{
	public $id;

	public function listVer () {
		global $paths;

		$revisions = scandir($paths['data']['templates'] . $this->id, 1);

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
}