<?php
require_once "config/db.php";
require_once "functions/isAuth.php";

isAuth();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel</title>
    <link rel="stylesheet" href="css/global.css">
</head>

<body>
    <img src="./images/flor.png" alt="flor" class="flor flor--1">
    <img src="./images/flor.png" alt="flor" class="flor flor--2">


    <main class="panel">
        <?php include('./template/menu.php') ?>
        <h1 class='index-title'>
            Bienvenida <?php echo $_SESSION['name'] ?>
        </h1>
    </main>

</body>

</html>