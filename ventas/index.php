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

        <section class="container overflow" id="sectionSales">
            <ul class="sale__list" id="salesContainer">

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
                    <div class="modal__buttons">
                        <div class="modal__divButton" id="divButtonPay">
                            <button type="button" class="modal__btn" id="btnShowModalPay">Registrar pago</button>
                        </div>

                        <div class="modal__divButtonHistory">
                            <button type="button" class="modal__btn modal__btn--history" id="btnShowModalHistory">Historial de pagos</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal modal--pay" id="modalPay" style="display: none;">

            <form class="form" id="formPay">
                <div class="modal__exitDiv">
                    <button type="button" class="modal__exit" id="btnCloseModalPay">x</button>
                </div>
                <h2 class="modal__title">Realizar pago</h2>

                <div class="form__item">
                    <label for="amount" class="form__label">Cantidad a pagar: </label>
                    <input type="number" step="0.01" name="amount" id="inputAmountPay" placeholder="Cantidad a pagar" class="form__input" min='0' required>
                </div>

                <input type="submit" value="Registrar pago" class="form__submit">
        </div>
        </div>

        <div class="modal modal-history"  id="modalHistory" style="display: none;">
            <div class="modal__container">
                <div class="modal__exitDiv">
                    <button type="button" class="modal__exit" id="btnCloseModalHistory">x</button>
                </div>
                <h2 class="modal__title">Historial de pagos</h2>

                <ul class="history__list">
                    <li class="history__item">
                        <p>Fecha del pago: <span>22/43/22</span></p>
                        <p>Cantidad: <span>$200.00</span></p>
                        <div class="history__buttons">
                            <img src="../images/edit.png" alt="editar el pago">
                            <img src="../images/delete.png" alt="eliminar el pago">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </main>


    <script src="../js/ventas.js"></script>

</body>

</html>