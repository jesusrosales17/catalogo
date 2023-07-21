<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();



if ($_SERVER['REQUEST_METHOD']  === 'POST') {
    $name = trim($db->escape_string($_POST['name']));
    $email = trim($db->escape_string($_POST['email']));
    $password = trim($db->escape_string($_POST['password']));


    if ($name === '' || $email === '' || $password === '') {
        $resp = [
            'code' => 400,
            'msg' => 'Todos los datos son obligatorios'
        ];
        print_r(json_encode($resp));
        http_response_code(400);
    } else {

        if (isset($_SESSION['rol']) && $_SESSION['rol'] === '0') {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $query = "INSERT INTO usuarios (email, password, nombre) VALUES ('$email', '$passwordHash', '$name')";
            $result = $db->query($query);

            if ($result) {
                $resp = [
                    "code" => 200,
                    "msg" => "Usuario agregado correctamente"
                ];
                print_r(json_encode($resp));
                http_response_code(200);
            } else {
                $resp = [
                    "code" => 400,
                    "msg" => "No se pudo agregar el usuario vuelva a intentarlo",
                ];
                print_r(json_encode($resp));
                http_response_code(200);
            }
        } else {
            $resp = [
                "code" => 400,
                "msg" => "No tienes los permisos para agregar usuarios",
            ];
            print_r(json_encode($resp));
            http_response_code(200);
        }
    }
}
if ($_SERVER['REQUEST_METHOD']  === 'GET') {
    $idUser = $_SESSION['id'];

    $query = "SELECT idUsuario, email, nombre, activo FROM usuarios";
    $response = $db->query($query);
    $data =  [];

    while ($row = $response->fetch_assoc()) {
        $data[] = $row;
    }

    print_r(json_encode($data));
    http_response_code(200);
}
