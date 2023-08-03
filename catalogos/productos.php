<?php
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
    <link rel="stylesheet" href="../css/productos.css">
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
            <h1 class="header__title">Productos</h1>
            <button class="header__btn" id="showModalForm">
                <img class="header__img" src="../images/add.png" alt="Agregar catalogo">
            </button>
            <form class="search" id="formSearch">
                <input type="text" id="search" name="search" class="search__input" placeholder="Buscar algun producto...">
            </form>
        </header>

        <section class="products container overflow-3" id="container">
            <table class="table" id="table">
                <thead class="table__head">
                    <tr class="table__tr table__tr--head">
                        <th class="table__th">Nombre</th>
                        <th class="table__th">Cant. Disponible</th>
                        <th class="table__th">Marca</th>
                        <th class="table__th">Precio Venta</th>
                        <th class="table__th"></th>
                    </tr>
                </thead>
                <tbody class="table__body" id="tableBody">
                    
                </tbody>
            </table>
        </section>

        <div class="modal" id='modalForm' style="display: none;">
            <form class="form container" id="form">
                <div class="form__exitDiv">
                    <button type="button" class="form__exit" id="closeModal">x</button>
                </div>
                <h2 class="form__title">Agregar Producto</h2>

                <div class="form__item">
                    <label for="name" class="form__label">Nombre del producto:</label>
                    <input type="text" id="name" name="name" class="form__input" placeholder="Ej. Tenis puma color negro">
                </div>

                <div class="form__item">
                    <label for="image" class="form__label">Imagen:</label>
                    <input type="file" name="image" id="image" class="form__input">
                </div>

                <div class="form__item">
                    <label for="brand" class="form__label">Marca del producto:</label>
                    <input type="text" name="brand" id="brand" class="form__input">
                </div>

                <div class="form__item">
                    <label for="description" class="form__label">Descripción del producto:</label>
                    <textarea name="description" class="form__input" id="description" cols="30" rows="10" placeholder="Ej. Tenis de puma color negro talla 25.."></textarea>
                </div>

                <div class="form__item">
                    <label for="dateAlta" class="form__label">Fecha de alta:</label>
                    <input type="date" name="dateAlta" id="dateAlta" class="form__input">
                </div>


                <div class="form__item">
                    <label for="type" class="form__label">Tipo:</label>
                    <input type="text" name="type" id="type" class="form__input" placeholder="Ej. Tenis">
                </div>

                <div class="form__item">
                    <label for="promocion" class="form__label">Promoción:</label>
                    <textarea name="promocion" class="form__input" id="promocion" cols="30" rows="10" placeholder="Ej. 20% de descuento"></textarea>
                </div>

                <div class="form__item">
                    <label for="buyPrice" class="form__label">Precio de compra:</label>
                    <input type="number" min='1' step="0.01" name="buyPrice" id="buyPrice" class="form__input" placeholder="Ej. $1000">
                </div>

                <div class="form__item">
                    <label for="salePrice" class="form__label">Precio de venta:</label>
                    <input type="number" min='1' step="0.01" name="salePrice" id="salePrice" class="form__input" placeholder="Ej. $1000">
                </div>

                <div class="form__item">
                    <label for="amound" class="form__label">Cantidad de productos:</label>
                    <input type="number" min='1'  name="amound" id="amound" class="form__input" placeholder="Ej. 6">
                </div>
                

                <input type="submit" class="form__submit" value="Agregar catalogo">
            </form>
        </div>

        <div class="modal" id='modalProduct' style="display: none;">
            <div class="modal__container container">

                <div class="modal__exitDiv">
                    <button type="button" class="modal__exit" id="closeModalProduct">x</button>
                </div>

                <h2 class="modal__title" data-attribute="nombre">Tenis azules</h2>
                <img src="" alt="" class="modal__img" id="imgProducto">

                <p class="modal__p">
                    Marca:
                    <span class="modal__span" data-attribute="marca"></span>
                </p>
                <p class="modal__p">
                    Descripción:
                    <span class="modal__span" data-attribute="descripcion">
                       
                    </span>
                </p>
                <p class="modal__p">
                    Fecha alta:
                    <span class="modal__span" data-attribute="fechaAlta"></span>
                </p>
                
                <p class="modal__p">
                    Tipo:
                    <span class="modal__span" data-attribute="tipo"></span>
                </p>
                <p class="modal__p">
                    Promoción:
                    <span class="modal__span" data-attribute="promocion"></span>
                </p>
                <p class="modal__p">
                    Precio compra: $
                    <span class="modal__span" data-attribute="precioCompra"></span>
                </p>
                <p class="modal__p">
                    Precio venta: $
                    <span class="modal__span" data-attribute="precioVenta"></span>
                </p>
                <p class="modal__p">
                    Cantidad de productos en el inventario: 
                    <span class="modal__span" data-attribute="cantidadProducto"></span>
                </p>
                <footer class="modal__footer">
                    <img src="../images/edit.png" alt="Editar producto" id="btnEdit">
                    <img src="../images/delete.png" alt="Eliminar producto" id="btnDelete">
                </footer>
            </div>

        </div>
    </main>

    <script src="../js/productosCatalogo.js"></script>

</body>

</html>