<?php
$password = "admin";
$email = "admin@gmail.com";
require "./config/db.php";

$db = connectDB();

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$query = "INSERT INTO usuarios (email, password) VALUES ('$email', '$passwordHash')";
$db->query($query);