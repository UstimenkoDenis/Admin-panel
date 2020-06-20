<?php
$htmlfiles = glob("../../*.html"); // разыскиваем все html в корне
$response = [];

foreach ($htmlfiles as $file) {
    array_push($response, basename($file));
}

echo json_encode($response);