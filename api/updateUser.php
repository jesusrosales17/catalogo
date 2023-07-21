<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();



if ($_SERVER['REQUEST_METHOD']  === 'POST') {
    $name = trim($db->escape_string($_POST['name']));
    $email = trim($db->escape_string($_POST['email']));
    $password = trim($db->escape_string($_POST['password']));
    $idUser = trim($db->escape_string($_POST['idUser']));
    $active = trim($db->escape_string($_POST['active']));



    if($idUser !== '') {
        if ($name === '' || $email === ''  || $active === '') {
            $resp = [
                'code' => 400,
                'msg' => 'Todos los datos son obligatorios'
            ];
            print_r(json_encode($resp));
            http_response_code(400);
        } else {
    
            if (isset($_SESSION['rol']) && $_SESSION['rol'] === '0') {
                if($password) {
                    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
                    $query = "UPDATE  usuarios SET email = '$email', password = '$passwordHash', nombre = '$name', activo = '$active' WHERE idUsuario = '$idUser'";
                } else {
                    $query = "UPDATE  usuarios SET email = '$email', nombre = '$name', activo = '$active' WHERE idUsuario = '$idUser'";

                }
                $result = $db->query($query);
    
                if ($result) {
                    $resp = [
                        "code" => 200,
                        "msg" => "Usuario actualizado correctamente"
                    ];
                    print_r(json_encode($resp));
                    http_response_code(200);
                } else {
                    $resp = [
                        "code" => 400,
                        "msg" => "No se pudo actualizar el usuario vuelva a intentarlo",
                    ];
                    print_r(json_encode($resp));
                    http_response_code(400);
                }
            } else {
                $resp = [
                    "code" => 400,
                    "msg" => "No tienes los permisos para agregar usuarios",
                ];
                print_r(json_encode($resp));
                http_response_code(400);
            }
        }
    } else {
        $resp = [
            "code" => 200,
            "msg" => "No se pudo actualizar el usuario vuelva a intentarlo"
        ];
        print_r(json_encode($resp));
        http_response_code(400);
    }
}