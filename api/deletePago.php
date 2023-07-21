<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //optener los datos y escaparlos
    
    header("Content-type: application/json; charset=utf-8");
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $db->escape_string($input["idPayment"]);
   
    

    if ($id) {
        //realizar la peticion
        
        $query = "SELECT cantidadPago, idVenta FROM pagos WHERE idPago = '$id'";
        $resp = $db->query($query);
        $dataPayment = $resp->fetch_assoc();
        $amout = $dataPayment['cantidadPago'];
        $idSale = $dataPayment['idVenta'];

        $query = "SELECT pagosRealizados, cantidadPagada, idCliente FROM ventas WHERE idVenta = '$idSale'";
        $resp = $db->query($query);
        $dataSale = $resp->fetch_assoc();
        $paymentsMade = $dataSale['pagosRealizados'];
        $amountPaid = $dataSale['cantidadPagada'];
        $idCliente = $dataSale['idCliente'];

        $query = "SELECT activo FROM clientes WHERE idCliente = '$idCliente'";
        $resp = $db->query($query);
        $result = $resp->fetch_assoc();
        $active = $result['activo'];
 
        if($active === '0') {
         $response = [
             'code'=> 400,
             'msg' => 'No se puede eliminar el pago ya que el cliente a sido eliminado'
         ];
         
         print_r(json_encode($response));
         http_response_code(400);
         return;
        }

        //descontar de la cantidad pagada lo que tenia el pago
        $amountPaid = floatval($amountPaid) - floatval($amountPaid);

       //descontar un pago a la venta
       $paymentsMade--;
       $query = "DELETE FROM pagos WHERE idPago = '$id'";
    
       $result = $db->query($query);
       
       if ($result) {
            $query = "UPDATE  `ventas` SET cantidadPagada='$amountPaid', pagosRealizados = '$paymentsMade'   WHERE idVenta = '$idSale'";
            $result = $db->query($query);
            $resp = [
                "code" => 200,
                "msg" => "Pago Eliminado  correctamente"
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
