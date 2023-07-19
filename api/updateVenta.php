<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();

function buscarElemento($arreglo, $clave, $valorBuscado)
{
    foreach ($arreglo as $elemento) {
        if ($elemento[$clave] === $valorBuscado) {
            return $elemento;
        }
    }
    return null; // Si no se encuentra el elemento, se retorna null o puedes elegir otro valor predeterminado.
}


if ($_SERVER['REQUEST_METHOD']  === 'POST') {
    $idSale = trim($db->escape_string($_POST['idVenta']));
    $idClient = trim($db->escape_string($_POST['client']));
    $wayToPay = trim($db->escape_string($_POST['wayToPay']));
    $paymentAmount = trim($db->escape_string($_POST['paymentAmount']));
    $sale = $_POST['pedido'];


    if (!$idSale || !$idClient) {
        $resp = [
            'code' => 400,
            'msg' => 'No se pudo actualizar la venta'
        ];
        print_r(json_encode($resp));
        http_response_code(400);
    } else {
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



            $ids = array_column($arrayPedido, 'idProducto');
            $idsStr = implode(',', $ids);

            $query = "SELECT idProducto, nombre, precioVenta, cantidadProducto  FROM productos WHERE idProducto IN ($idsStr)";
            $response = $db->query($query);
            $data =  [];
            while ($row = $response->fetch_assoc()) {
                $data[] = $row;
            }

            $querySale = "SELECT pedido FROM ventas WHERE idVenta = '$idSale'";

            $response = $db->query($querySale);

            $dataSalePreviousJson = $response->fetch_assoc()['pedido'];
            $arraySalePrevious = json_decode($dataSalePreviousJson, true);





            foreach ($arraySalePrevious as $previusSale) {
                //ver si existe un producto o fue retirado
                $salesDataIfAny = buscarElemento($arrayPedido, 'idProducto', $previusSale['idProducto']);

                if (!$salesDataIfAny) {
                    // si no existe regresar la cantidad de elementos comprados
                    $query = "SELECT cantidadProducto FROM productos WHERE idProducto = " . $previusSale['idProducto'];
                    $response = $db->query($query);
                    $cantidadProducto = $response->fetch_assoc()['cantidadProducto'];

                    $cantidadProducto += $previusSale['cantidadAVender'];
                    $query = "UPDATE productos SET cantidadProducto = '$cantidadProducto' WHERE idProducto = " . $previusSale['idProducto'];
                    $resp = $db->query($query);
                } else {
                    // si existe ver si la cantidad aumento o disminuyo o se mantuvo igual
                    foreach ($arrayPedido as $pedido) {

                        if ($previusSale['idProducto'] === $pedido['idProducto']) {
                            $dataProduct = buscarElemento($data, 'idProducto', $pedido['idProducto']);
                            if ($previusSale['cantidadAVender'] === $pedido['cantidadAVender']) {
                                $totalPedido += $dataProduct['precioVenta'] * $pedido['cantidadAVender'];
                            } else {
                               
                                $cant = 0;
                                if ($previusSale['cantidadAVender'] > $pedido['cantidadAVender']) {
                                    //calcular la diferencia
                                    $cant = $previusSale['cantidadAVender'] - $pedido['cantidadAVender'];
                                    $totalPedido += $dataProduct['precioVenta'] * $pedido['cantidadAVender'];

                                    //actualizar la cantidad del producto en la base de datos
                                    $cant += $dataProduct['cantidadProducto'];
                                } elseif ($previusSale['cantidadAVender'] < $pedido['cantidadAVender']) {
                                    
                                    //ver si no sobrepasa la cantidad de productos
                                    // y calcular la diferencia para quitarsela al producto
                                   
                                    if ( intval( $pedido['cantidadAVender'] ) > intval($dataProduct['cantidadProducto']) + intval($previusSale['cantidadAVender']) ) {
                                        
                                        $cant = $previusSale['cantidadAVender'];
                                        $totalPedido += $dataProduct['precioVenta'] * $previusSale['cantidadAVender'];
                                    } else { 
                                        $cant = $pedido['cantidadAVender'] - $previusSale['cantidadAVender'];
                                        $totalPedido += $dataProduct['precioVenta'] * $pedido['cantidadAVender'];
                                    }


                                    $cant = $dataProduct['cantidadProducto'] - $cant;
                                }
                                //actualizar la cantidad del producto  en la base de datos
                                $query = "UPDATE productos SET cantidadProducto = '$cant' WHERE idProducto = " . $previusSale['idProducto'];
                                
                                $response = $db->query($query);
                            }
                        }
                    }
                }
            }


          


            if ($wayToPay == 1) {
                $paymentAmount = 1;
            }

            $query = "UPDATE ventas SET idCliente = '$idClient', totalDeVenta = '$totalPedido', pedido = '$sale', formaPago = '$wayToPay', cantidadPagos = '$paymentAmount' WHERE idVenta = '$idSale'";

            $result = $db->query($query);


            if ($result) {
                $resp = [
                    "code" => 200,
                    "msg" => "Venta actualizada correctamente"
                ];
                print_r(json_encode($resp));
                http_response_code(200);
            } else {
                $resp = [
                    "code" => 400,
                    "msg" => "No se pudo actualizar la venta, vuelva a intentarlo",
                ];
                print_r(json_encode($resp));
                http_response_code(200);
            }
        }
    }
}
