<?php
require("../config/db.php");
$db = connectDB();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $idProdcuto = trim($db->escape_string($_POST["idProducto"]));
    $name = trim($db->escape_string($_POST["name"]));
    $brand = trim($db->escape_string($_POST["brand"]));
    $description = trim($db->escape_string($_POST["description"]));
    $dateAlta = trim($db->escape_string($_POST["dateAlta"]));
    $dateBaja = trim($db->escape_string($_POST["dateBaja"]));
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


        if($dateBaja === '') {
            $query = "UPDATE  `productos` SET nombre = '$name', imagen = '$nombreImagen', marca = '$brand', descripcion = '$description', fechaAlta = '$dateAlta' , tipo = '$type', promocion = '$promocion', precioCompra = '$buyPrice', precioVenta = '$salePrice',  cantidadProducto = '$amound' WHERE idProducto = '$idProdcuto' ";
        } else {
            $query = "UPDATE  `productos` SET nombre = '$name', imagen = '$nombreImagen', marca = '$brand', descripcion = '$description', fechaAlta = '$dateAlta' , tipo = '$type', promocion = '$promocion', precioCompra = '$buyPrice', precioVenta = '$salePrice', fechaBaja = '$dateBaja', cantidadProducto = '$amound' WHERE idProducto = '$idProdcuto' ";
        }

        $result = $db->query($query);

        if ($result) {
            $resp = [
                "code" => 200,
                "msg" => "Servicio actualizado  correctamente",
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
