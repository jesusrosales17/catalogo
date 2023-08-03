<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();
$db = connectDB();


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $idProdcuto = trim($db->escape_string($_POST["idProducto"]));
    $name = trim($db->escape_string($_POST["name"]));
    $brand = trim($db->escape_string($_POST["brand"]));
    $description = trim($db->escape_string($_POST["description"]));
    $dateAlta = trim($db->escape_string($_POST["dateAlta"]));
    $type = trim($db->escape_string($_POST["type"]));
    $promocion = trim($db->escape_string($_POST["promocion"]));
    $buyPrice = trim($db->escape_string($_POST["buyPrice"]));
    $salePrice = trim($db->escape_string($_POST["salePrice"]));
    $amound = trim($db->escape_string($_POST["amound"]));
    $imgActual = trim($db->escape_string($_POST["imagenActual"]));
    $imagen = $_FILES["image"];

    if (
        $name === '' ||
        $brand === '' ||
        $description === '' ||
        $dateAlta === '' ||
        $type === '' ||
        $promocion === '' ||
        $buyPrice === '' ||
        $salePrice === '' ||
        !$imagen
    ) {
        $respuesta = [
            "code" => 400,
            "msg" => "Verifique que halla llenado todos los campos"
        ];
        print_r(json_encode($respuesta));
        http_response_code(400);
    } else {
        $idUser = $_SESSION['id'];
        $query = "SELECT idCatalogo FROM productos WHERE idProducto = '$idProdcuto'";
        $resp = $db->query($query);
        $idCatalogo = $resp-> fetch_assoc()['idCatalogo'];
        $query = 'SELECT nombre FROM productos WHERE nombre = "' . $name . '" AND idUsuario = "' . $idUser . '" AND idCatalogo = "' . $idCatalogo .'" AND activo = 1';
       
        $response = $db->query($query);
        if ($response->num_rows > 0) {
            $resp = [
                'code' => 400,
                'msg' => 'Ya existe un producto con el mismo nombre en este catalogo'
            ];
            print_r(json_encode($resp));
            http_response_code(400);
            return;
        }
        $carpetaImagenes = "../images/products";



        if (!is_dir($carpetaImagenes)) {
            mkdir($carpetaImagenes);
        }
        $nombreImagen = "";

        if ($imagen["name"]) {
            //eliminar la imagen previa
            if ($imgActual != "") {
                unlink($carpetaImagenes . "/" . $imgActual);
            }

            $nombreImagen = md5(uniqid(rand(), true)) . ".jpg";

            //subir la imagen
            move_uploaded_file($imagen["tmp_name"], $carpetaImagenes . "/" . $nombreImagen);
        } else {
            $nombreImagen = $imgActual;
        }


  
            $query = "UPDATE  `productos` SET nombre = '$name', imagen = '$nombreImagen', marca = '$brand', descripcion = '$description', fechaAlta = '$dateAlta' , tipo = '$type', promocion = '$promocion', precioCompra = '$buyPrice', precioVenta = '$salePrice',  cantidadProducto = '$amound' WHERE idProducto = '$idProdcuto' ";
       

        $result = $db->query($query);

        if ($result) {
            $resp = [
                "code" => 200,
                "msg" => "Producto actualizado  correctamente",
            ];
            print_r(json_encode($resp));
            http_response_code(200);
        } else {
            $resp = [
                "code" => 400,
                "msg" => "Ocurrio un error"
            ];
            print_r(json_encode($resp));
            http_response_code(400);
        }
    }
}
