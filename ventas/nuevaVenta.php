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
    <title>Nueva venta</title>
    <link rel="stylesheet" href="../css/global.css">
    <link rel="stylesheet" href="../css/nuevaVenta.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <img src="../images/flor.png" alt="flor" class="flor flor--1">
    <img src="../images/flor.png" alt="flor" class="flor flor--2">


    <main class="panel catalogos">
        <?php include('../template/menu.php') ?>

        <header class="header container">
            <h1 class="header__title">Nueva Venta</h1>
            <form class="search" id="formSearch">
                <input type="text" class="search__input" placeholder="Busca un producto..." name="search" id="search">
                <select name="catalogo" id="selectCatalogo">
                    <option value="" selected>-- Elige un catalogo --</option>
                </select>
            </form>
        </header>

        <section class="products container overflow" id="container">
            <ul class="products__list" id="list">

            </ul>

        </section>

        <button type="button" class="btnNewSale" id="btnShowModalForm">
            Registrar Venta
        </button>

    </main>

    <div class="modal" id="modal" style="display: none;">
        <form class="form container" id="form">
            <div class="form__exitDiv">
                <button type="button" class="form__exit" id="btnCloseModalForm">x</button>
            </div>
            <h2 class="form__title">Registrar venta</h2>
            <div class="form__item">
                <label class="form__label" for="client">Cliente: </label>
                    <select required class="form__input" name="client" id="clientInput">
                        <option value="">-- Selecciona un cliente --</option>
                    </select>
            </div>

            <div class="sale">
                <h3 class="sale__title">Articulos seleccionados</h3>
                <ul class="sale__list" id="listSale">
                    
                </ul>
            </div>

   
            <div class="form__item">
                <label class="form__label" for="client">Forma pago: </label>
                    <select required class="form__input" name="wayToPay" id="wayToPay">
                        <option value="">-- Selecciona una forma de pago --</option>
                        <option value="1">Al contado</option>
                        <option value="2">Pagos diarios</option>
                        <option value="3">Pagos semanales</option>
                        <option value="4">Pagos quincenales</option>
                        <option value="5">Pagos mesuales</option>
                    </select>
            </div>

            <div class="form__item" style="display: none;" id="inputPaymentAmount">
                <label class="form__label" for="paymentAmount">Cantidad de pagos: </label>
                <input class="form__input" type="number" name="paymentAmount" id="paymentAmount" min="0" placeholder="Ej. 12" >
            </div>


            <div class="resum">
                <h4 class="resum__title">Resumen Final: </h4>

                <div class="resum__content">
                    <p>Cliente: <span id="resumNameClient">No seleccionado</span></p>
                    <p>Cantidad de productos: <span id="resumAmoundProductsSale">3</span></p>
                    <p>Total de la compra: <span id="resumFullSalePrice"></span></p>
                    <p>Forma de pago: <span id="ResumWayToPay">No seleccionada</span></p>
                    <p>Total de pagos: <span id="resumTotalPayments">---</span></p>
                </div>
            </div>

            <div class="form__item">
                <input class="form__submit" type="submit" value="Registrar la venta">
            </div>
        </form>
    </div>

    <script src="../js/nuevaVenta.js"></script>

</body>

</html>