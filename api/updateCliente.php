<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();

if($_SERVER['REQUEST_METHOD']  === 'POST') {
    $name = trim($db->escape_string($_POST['name']));
    $birthdate = trim($db->escape_string($_POST['birthdate']));
    $numberPhone = trim($db->escape_string($_POST['numberPhone']));
    $id = trim($db->escape_string($_POST['id']));


    if($id === '' || $birthdate === '' || $numberPhone === '') {
        $resp = [
            'code'=> 400,
            'msg' => 'Todos los datos son obligatorios'
        ];
        print_r(json_encode($resp));
        http_response_code(400);
    } else {
        if($name === '') {
            $resp = [
                'code'=> 400,
                'msg' => 'Todos los datos son obligatorios'
            ];
            print_r(json_encode($resp));
            http_response_code(400);
        } else {
            $query = "UPDATE clientes SET nombreCompleto = '$name', telefono = '$numberPhone', fechaNacimiento = '$birthdate' WHERE idCliente = '$id'";
            $result = $db->query($query);
    
            if ($result) {
                $resp = [
                  "code" => 200,
                  "msg" => "Cliente actualizado correctamente"
                ];
                print_r(json_encode($resp));
                http_response_code(200);
              } else {
                $resp = [
                    "code" => 400,
                    "msg" => "No se pudo actualizar el cliente vuelva a intentarlo",
                  ];
                  print_r(json_encode($resp));
                  http_response_code(400);
              }
        }
    }
}