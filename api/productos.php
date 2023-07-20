<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    // Obtener la URL actual
    $current_url = "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

    // Obtener los componentes de la URL
    $url_components = parse_url($current_url);

    // Obtener el path de la URL (la ruta)
    $path = $url_components['path'];

    // Dividir la ruta en segmentos utilizando '/'
    $segments = explode('/', $path);

    // Obtener el último segmento (el ID)
    $id = end($segments);

   

    if(is_numeric($id)) {
        $query = "SELECT idCatalogo FROM catalogos WHERE idCatalogo = '$id' AND activo='1'";
    
        $resp =  $db->query($query);
        if ($resp->num_rows) {
    
            $query = "SELECT * FROM productos WHERE idCatalogo = '$id ' AND activo='1'";
            $resp =  $db->query($query);
    
    
            $data = [];
            while ($row = $resp->fetch_assoc()) {
                $data[] = $row;
            }
            $respuesta = [
                'code' => 200,
                'data' => $data
            ];
            print_r(json_encode($respuesta));
            http_response_code(200);
        } else {
            $respuesta = [
                "code" => 404,
                "msg" => "El catalogo no existe"
            ];
            print_r(json_encode($respuesta));
            http_response_code(404);
        }
    } else {
        $query = "SELECT * FROM productos";
        $resp =  $db->query($query);


        $data = [];
        while ($row = $resp->fetch_assoc()) {
            $data[] = $row;
        }
        
        print_r(json_encode($data));
        http_response_code(200);
    }

}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    //optener y escapar los datos
    $idCatalogo = trim($db->escape_string($_POST["idCatalogo"]));
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
    $imagen = $_FILES["image"];

    //checar que si haya llenado los datos obligatorios
    if (
        !$name ||
        !$brand ||
        !$description ||
        !$dateAlta ||
        !$dateBaja ||
        !$type ||
        !$promocion ||
        !$buyPrice ||
        !$salePrice ||
        !$amound ||
        !$imagen 
    ) {
        //SI no ingreso los datos obligarios mandar el mensaje correspondiente
        $respuesta = [
            "code" => 400,
            "msg" => "Todos los datos son obligatorios"
        ];
        print_r(json_encode($respuesta));
        http_response_code(400);
    } else {
        $carpetaImagenes = "../images/products";

        //si la carpeta imagenes no existe crearla
        if (!is_dir($carpetaImagenes)) {
            mkdir($carpetaImagenes);
        }
        //generar un nombre unico
        if ($imagen["name"] != "") {
            $nombreImagen = md5(uniqid(rand(), true)) . ".jpg";
            //mover la imagen
            move_uploaded_file($imagen["tmp_name"], $carpetaImagenes . "/" . $nombreImagen);
        } else {
            $nombreImagen = "";
        }

        //poner el nombre del producto y la descripcion en minuscular


        //realizar la peticion
        $query = "INSERT INTO productos (idCatalogo,nombre, imagen, marca, descripcion, fechaAlta, tipo, promocion, precioCompra, precioVenta, fechaBaja, cantidadProducto)
         VALUES ('$idCatalogo', '$name', '$nombreImagen', '$brand', '$description', '$dateAlta', '$type', '$promocion', '$buyPrice', '$salePrice', '$dateBaja', '$amound')";
        $result = $db->query($query);


        // si todo sale bien mandar la respuesta de exito
        if ($result) {
            $resp = [
                "code" => 200,
                "msg" => "Producto agregado correctamente",
            ];
            print_r(json_encode($resp));
            http_response_code(200);
        } else {
            $resp = [
                "code" => 400,
                "msg" => "No se pudo agregar el producto",
            ];
            print_r(json_encode($resp));
            http_response_code(200);
        }
    }
}
