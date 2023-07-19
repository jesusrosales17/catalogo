<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //optener los datos y escaparlos
    
    header("Content-type: application/json; charset=utf-8");
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $db->escape_string($input["id"]);
   
    

    if ($id) {
        //realizar la peticion
        $query = "UPDATE  `productos` SET activo='0' WHERE idProducto = '$id'";
        $result = $db->query($query);


        if ($result) {
            $resp = [
                "code" => 200,
                "msg" => "Producto Eliminado  correctamente"
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
    } else {
        $respuesta = [
            "code" => 400,
            "msg" => "Ocurrio un error"
        ];
        print_r(json_encode($respuesta));
        http_response_code(400);
    }
}
