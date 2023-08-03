<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();



if($_SERVER['REQUEST_METHOD']  === 'POST') {
    $name = trim($db->escape_string($_POST['name']));

    if($name === '') {
        $resp = [
            'code'=> 400,
            'msg' => 'El nombre del catalogo es un dato obligatorio'
        ];
        print_r(json_encode($resp));
        http_response_code(400);
    } else {

        $idUser = $_SESSION['id'];

        $query = 'SELECT nombre FROM catalogos WHERE nombre = "'.$name.'" AND idUsuario = "'.$idUser.'" AND activo = 1';
        $response = $db->query($query);
        if($response->num_rows > 0) {
            $resp = [
                'code'=> 400,
                'msg' => 'El nombre del catalogo ya existe'
            ];
            print_r(json_encode($resp));
            http_response_code(400);
            return;
        }
        $query = "INSERT INTO catalogos (nombre, idUsuario) VALUES ('$name', '$idUser')";
        $result = $db->query($query);

        if ($result) {
            $resp = [
              "code" => 200,
              "msg" => "Catalogo agregado correctamente"
            ];
            print_r(json_encode($resp));
            http_response_code(200);
          } else {
            $resp = [
                "code" => 400,
                "msg" => "No se pudo agregar el catalogo vuelva a intentarlo",
              ];
              print_r(json_encode($resp));
              http_response_code(200);
          }
    }
}
if($_SERVER['REQUEST_METHOD']  === 'GET') {
    $idUser = $_SESSION['id'];

    $query = "SELECT * FROM catalogos WHERE idUsuario = '$idUser' ORDER BY idCatalogo DESC";
    $response = $db->query($query);
    $data =  [];

    while($row = $response->fetch_assoc()) {
        $data[] = $row;
    }

    print_r(json_encode($data));
    http_response_code(200);
}