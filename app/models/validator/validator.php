<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

//extract data from the post
// extract($_POST);

function getData($postString){

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
    return $result;
}
$fields = array(
    'fragment' => urlencode($_POST['fragment']),
    'output' => urlencode($_POST['output']),
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
$returned_content = getData($postString);

echo $returned_content;