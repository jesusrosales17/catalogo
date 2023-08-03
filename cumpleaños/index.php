<?php
require_once "../config/db.php";
require_once "../functions/isAuth.php";

isAuth();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cumpleaños</title>
    <link rel="stylesheet" href="../css/global.css">
    <link rel="stylesheet" href="../css/cumpleaños.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js"></script>
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
</head>

<body>
  
    <img src="../images/flor.png" alt="flor" class="flor flor--2">
    <div class="spinner-container" style="display: none;" id="spinner">
        <div class="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>

    <main class="panel catalogos">
        <?php include('../template/menu.php') ?>

        <div class="header container">
            <h1 class="header__title">Cumpleaños de los clientes</h1>
        </div>

        <section class="container">
            <div id="calendar"></div>
        </section>

        <div class="modal" style="display: none;" id="modal">
            <div class="modal__container">
                <div class="modal__exitDiv">
                    <button type="button" class="modal__exit" id="closeModal">x</button>
                </div>
                <h3 class="modal__title">Cumpleaños de: <span id="spanNameClient"></span></h3>
                <p>Cliente desde: <span id="spanYear"></span></p>
                <p>Numero de Telefono: <span id="spanNumberPhone"></span></p>
            </div>
        </div>
    </main>
   
    <script src="../js/cumpleaños.js"></script>

</body>

</html>