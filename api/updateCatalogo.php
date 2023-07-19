<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();

if($_SERVER['REQUEST_METHOD']  === 'POST') {
    $name = trim($db->escape_string($_POST['name']));
    $id = trim($db->escape_string($_POST['id']));


    if(!$id) {
        $resp = [
            'code'=> 400,
            'msg' => 'No se pudo actualizar el catalogo, vuelva a intentarlo'
        ];
        print_r(json_encode($resp));
        http_response_code(400);
    } else {
        if(!$name) {
            $resp = [
                'code'=> 400,
                'msg' => 'El nombre del catalogo es un dato obligatorio'
            ];
            print_r(json_encode($resp));
            http_response_code(400);
        } else {
            $query = "UPDATE catalogos SET nombre = '$name' WHERE idCatalogo = '$id'";
            $result = $db->query($query);
    
            if ($result) {
                $resp = [
                  "code" => 200,
                  "msg" => "Catalogo actualizado correctamente"
                ];
                print_r(json_encode($resp));
                http_response_code(200);
              } else {
                $resp = [
                    "code" => 400,
                    "msg" => "No se pudo actualizar el catalogo vuelva a intentarlo",
                  ];
                  print_r(json_encode($resp));
                  http_response_code(200);
              }
        }
    }
}