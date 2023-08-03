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
    <title>Clientes</title>
    <link rel="stylesheet" href="../css/global.css">
    <link rel="stylesheet" href="../css/clientes.css">
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

        <header class="header container">
            <h1 class="header__title">Clientes</h1>
            <button class="header__btn" id="showModalForm">
                <img class="header__img" src="../images/add.png" alt="Agregar catalogo">
            </button>
            <form class="search" id="formSearch">
                <input type="text" class="search__input" id="search" name="search" placeholder="Buscar un cliente...">
            </form>
        </header>

        <section class="products container overflow-3" id="container">
            <table class="table" id="table">
                <thead class="table__head">
                    <tr class="table__tr table__tr--head">
                        <th class="table__th">Nombre Completo</th>
                        <th class="table__th">Telefono</th>
                        <th class="table__th">Fecha de cumpleaños</th>
                        <th class="table__th"></th>
                    </tr>
                </thead>
                <tbody class="table__body" id="tableBody">
                    
                </tbody>
            </table>
        </section>

        <div class="modal" id='modal' style="display: none;">
            <form class="form container" id="form">
                <div class="form__exitDiv">
                    <button type="button" class="form__exit" id="closeModalForm">x</button>
                </div>
                <h2 class="form__title">Agregar Cliente</h2>

                <div class="form__item">
                    <label for="name" class="form__label">Nombre Completo:</label>
                    <input type="text" id="name" name="name" class="form__input" placeholder="Ej. Juan Rosales Rosales" required>
                </div>

                <div class="form__item">
                    <label for="numberPhone" class="form__label">Número de telefono:</label>
                    <input type="tel" id="numberPhone" name="numberPhone" class="form__input" placeholder="Ej. 7712249002" minlength="10" maxlength="10"  required>
                </div>

                <div class="form__item">
                    <label for="birthdate" class="form__label">Fecha de nacimiento:</label>
                    <input type="date" id="birthdate" name="birthdate" class="form__input" required>
                </div>
                <input type="submit" class="form__submit" value="Agregar cliente">
            </form>
        </div>
    </main>

    <script src="../js/clientes.js"></script>

</body>

</html>