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
    <title>Administrador</title>
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="stylesheet" href="../css/global.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <main class="admin panel container">
        <nav>
            <a href="../cerrar-sesion.php">Cerrar Sesion</a>
        </nav>
        <h1 class="admin__title">Usuarios</h1>
        <div class="admin__divButton">
            <button type="button" class="admin__button" id="addUser">Nuevo usuario</button>
        </div>

         <div class="admin__content" id="container">
             <table class="users__table" id="table">
                 <thead>
                     <th>Nombre</th>
                     <th>Correo</th>
                     <th>Activo</th>
                     <th></th>
                 </thead>
     
                 <tbody id="tbody">
     
                 </tbody>
             </table>
         </div>
         
         <div class="modal" id="modal" style="display: none;">
            <form id="form" class="form">
                <div class="modal__exitDiv">
                    <button type="button" class="modal__exit" id="btnClose">x</button>
                </div>
                <h2 class="form__title" id="formTitle">Agregar usuario</h2>

                <div class="form__item">
                    <label for="name" class="form__label">Nombre: </label>
                    <input type="text" id="name" name="name" class="form__input" placeholder="Nombre del usuario" required>
                </div>

                <div class="form__item">
                    <label for="email" class="form__label">Correo: </label>
                    <input type="email" id="email" name="email" class="form__input" placeholder="Correo del usuario" required>
                </div>

                <div class="form__item">
                    <label for="password" class="form__label">Contraseña: </label>
                    <input type="password" id="password" name="password" class="form__input" placeholder="Contraseña del usuario">
                </div>

                <div class="form__item" id="select">
                    <label for="active" class="form__label">Activo: </label>
                    <select name="active" id="active" class="form__input">
                        <option value="">Elige una opción</option>
                        <option value="0">No</option>
                        <option value="1">Si</option>
                    </select>
                </div>

                <input type="submit" value="Agregar usuario" class="form__submit" id="btnSubmit">
            </form>
         </div>

    </main>

    <script src="../js/admin.js"></script>
</body>
</html>