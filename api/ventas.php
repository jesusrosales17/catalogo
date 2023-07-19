<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();



if ($_SERVER['REQUEST_METHOD']  === 'POST') {

    $idClient = trim($db->escape_string($_POST['client']));
    $wayToPay = trim($db->escape_string($_POST['wayToPay']));
    $paymentAmount = trim($db->escape_string($_POST['paymentAmount']));
    $sale = $_POST['pedido'];


    if (!$idClient || !$wayToPay || !$sale) {

        $resp = [
            'code' => 400,
            'msg' => 'Todos los datos son obligatorios'
        ];
        print_r(json_encode($resp));
        http_response_code(400);
    } else {
        if ($wayToPay > 1) {
            if (!$paymentAmount) {
                $resp = [
                    'code' => 400,
                    'msg' => 'Todos los datos son obligatorios'
                ];
                print_r(json_encode($resp));
                http_response_code(400);
                return;
            }
        }


        $arrayPedido = json_decode($sale, true);
        $totalPedido = 0;

        // Recorrer el arreglo y hacer algo con sus elementos

        $ids = array_column($arrayPedido, 'idProducto');
        $idsStr = implode(',', $ids);
        // foreach ($arrayPedido as $pedido) {
        //    $idPedido = $pedido["idProducto"];
            $query = "SELECT idProducto, nombre, precioVenta, cantidadProducto  FROM productos WHERE idProducto IN ($idsStr)";
            $response = $db->query($query);
            
        // }
        $data =  [];
        while($row = $response->fetch_assoc()) {
            $data[] = $row;
        }

        foreach ($arrayPedido as $pedido)  {
            foreach($data as $producto) {
                if ($pedido['idProducto'] === $producto['idProducto']) {
                    if($producto['cantidadProducto'] < $pedido['cantidadAVender']) {
                        $resp = [
                            'code' => 400,
                            'msg' => 'No hay suficiente producto de ' . $producto['nombre'] . ' para realizar la venta'
                        ];
                        print_r(json_encode($resp));
                        http_response_code(400);
                        return;
                    } else {
                        $totalPedido += $producto['precioVenta'] * $pedido['cantidadAVender'];
                    }
                }
            }
        }
       
        if($wayToPay == 1) {
            $paymentAmount = 1;
        }
        
        $query = "INSERT INTO ventas (idCliente, totalDeVenta, pedido, formaPago, cantidadPagos) VALUES ('$idClient', '$totalPedido', '$sale', '$wayToPay', '$paymentAmount')";
       
        $result = $db->query($query);
        

        if ($result) {
            foreach ($arrayPedido as $pedido)  {
                foreach($data as $producto) {
                    if ($pedido['idProducto'] === $producto['idProducto']) {
                        $cantidad = $producto['cantidadProducto'] - $pedido['cantidadAVender'];
                       $query = "UPDATE productos SET cantidadProducto = '$cantidad' WHERE idProducto = ".$producto['idProducto'];
                       $resp = $db->query($query);
                    }
                }
            }


            $resp = [
                "code" => 200,
                "msg" => "Venta registrada correctamente"
            ];
            print_r(json_encode($resp));
            http_response_code(200);
        } else {
            $resp = [
                "code" => 400,
                "msg" => "No se pudo registrar la venta vuelva a intentarlo",
            ];
            print_r(json_encode($resp));
            http_response_code(200);
        }
    }
}

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
        
        $query = "SELECT idVenta FROM ventas WHERE idVenta = '$id'";
    
        $resp =  $db->query($query);
        if ($resp->num_rows) {
    
            $query = "SELECT * FROM ventas WHERE idVenta = '$id'";
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
                "msg" => "La venta no existe"
            ];
            print_r(json_encode($respuesta));
            http_response_code(404);
        }
    } else {
        $query = "SELECT * FROM ventas";
        $response = $db->query($query);
        $data =  [];
    
        while ($row = $response->fetch_assoc()) {
            $data[] = $row;
        }
    
        print_r(json_encode($data));
        http_response_code(200);
    }

}