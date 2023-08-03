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
    <title>Catalogos</title>
    <link rel="stylesheet" href="../css/global.css">
    <link rel="stylesheet" href="../css/catalogos.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
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
            <h1 class="header__title">Catalogos</h1>
            <button class="header__btn" id="showModal">
                <img class="header__img" src="../images/add.png" alt="Agregar catalogo">
            </button>
        </div>

        <section class="container overflow-2">
            <ul class="catalogos__list" id="containerCatalogos">

            </ul>
        </section>

        <div class="modal" id='modal' style="display: none;">
            <form class="form container" id="form">
                <div class="form__exitDiv">
                    <button type="button" class="form__exit" id="closeModal">x</button>
                </div>
                <h2 class="form__title">Agregar Catalogo</h2>
                <label for="name" class="form__label">Nombre del catalogo:</label>
                <input type="text" id="name" name="name" class="form__input" placeholder="Ej. Avon catalogo 23">
                <input type="submit" class="form__submit" value="Agregar catalogo">
            </form>
        </div>
    </main>

    <script src="../js/catalogos.js"></script>

</body>

</html>