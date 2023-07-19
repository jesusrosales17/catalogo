<?php
function connectDB(): mysqli {
    $host = "localhost";
    $user = "root";
    $password = "";
    $database = "sistemaCatalogo";
    $db = new mysqli($host, $user, $password, $database);

    if($db->connect_errno) {
        echo "Fallo al conectar a MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
    }

    return $db;
}

?>