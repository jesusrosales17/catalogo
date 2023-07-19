<?php
require_once "../config/db.php";
require_once "../functions/isAuth.php";

isAuth();
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ventas</title>
    <link rel="stylesheet" href="../css/global.css">
    <link rel="stylesheet" href="../css/ventas.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <img src="../images/flor.png" alt="flor" class="flor flor--1">
    <img src="../images/flor.png" alt="flor" class="flor flor--2">


    <main class="panel catalogos">
        <?php include('../template/menu.php') ?>

        <div class="header container">
            <h1 class="header__title">Ventas</h1>
            <a href="./nuevaVenta.php" class="header__btn">
                <img class="header__img" src="../images/add.png" alt="Agregar catalogo">
            </a>
        </div>
        <select class="select" name='client' id="client">
            <option value="" selected>-- Elige un cliente --</option>
        </select>

        <section class="container" id="sectionSales">
            <ul class="sale__list" id="salesContainer" >
                
            </ul>
        </section>

        <div class="modal" id="modal" style="display: none;">
            <div class="modal__container">
                <div class="modal__exitDiv">
                    <button type="button" class="modal__exit" id="btnModalExit">x</button>
                </div>
                <h2 class="modal__title">Informe de venta</h2>


                <div class="modal__content">
                    <h3 class="modal__subtitle"> Productos vendidos: </h3>

                    <ul class="sale__list" id="list-products">

                    </ul>

                    <p>Cliente: <span id="spanName"></span></p>
                    <p>Fecha de la venta: <span id="spanYear"></span></p>
                    <p>Cantidad de productos vendidos: <span id="SpanAmountSold"></span></p>
                    <p>Monto total de la compra: <span id="SpanTotalSale"></span></p>
                    <p>Cantidad pagada: <span id="spanAmountPaid"></span></p>
                    <p>Forma de pago: <span id="spanWayToPay"></span></p> 
                    <p>Pagos totales: <span id="spanTotalPayments"></span></p>
                    <p>Pagos realizados: <span id="spanPaymentsMade"></span></p>
                </div>
            </div>
        </div>
    </main>


    <script src="../js/ventas.js"></script>

</body>

</html>