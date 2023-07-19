<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();



if($_SERVER['REQUEST_METHOD']  === 'POST') {
    $name = trim($db->escape_string($_POST['name']));
    $birthdate = trim($db->escape_string($_POST['birthdate']));
    $numberPhone = trim($db->escape_string($_POST['numberPhone']));


    if(!$name || !$birthdate || !$numberPhone) {
        $resp = [
            'code'=> 400,
            'msg' => 'Todos los datos son obligatorios'
        ];
        print_r(json_encode($resp));
        http_response_code(400);
    } else {
        $query = "INSERT INTO clientes (nombreCompleto, telefono, fechaNacimiento) VALUES ('$name', '$numberPhone', '$birthdate')";
        $result = $db->query($query);

        if ($result) {
            $resp = [
              "code" => 200,
              "msg" => "Cliente agregado correctamente"
            ];
            print_r(json_encode($resp));
            http_response_code(200);
          } else {
            $resp = [
                "code" => 400,
                "msg" => "No se pudo agregar el cliente vuelva a intentarlo",
              ];
              print_r(json_encode($resp));
              http_response_code(200);
          }
    }
}
if($_SERVER['REQUEST_METHOD']  === 'GET') {
    $query = "SELECT * FROM clientes WHERE activo='1' ORDER BY idCliente DESC";
    $response = $db->query($query);
    $data =  [];

    while($row = $response->fetch_assoc()) {
        $data[] = $row;
    }

    print_r(json_encode($data));
    http_response_code(200);
}