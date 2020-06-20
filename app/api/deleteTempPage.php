<?php
$file = "../../jv38hffnkfknf_4i.html";

if (file_exists($file)) {
    unlink($file);         // удаление
} else {
    header("HTTP/1.0 400 Bad Request");
}