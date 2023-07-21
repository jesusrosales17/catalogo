<?php
$password = "shk_Saul_Jesus-123";
$email = "jesusrosales07537@gmail.com";
$rol = "0";
require "./config/db.php";

$db = connectDB();

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$query = "INSERT INTO backup (email, password, rol) VALUES ('$email', '$passwordHash', '$rol')";
$db->query($query);