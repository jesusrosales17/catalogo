<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();



if($_SERVER['REQUEST_METHOD']  === 'POST') {
    $idSale = trim($db->escape_string($_POST['idSale']));
    $idPayment = trim($db->escape_string($_POST['idPayment']));
    $amount = trim($db->escape_string($_POST['amount']));


   if(!$idSale|| !$idPayment ) {
    $resp = [
        'code'=> 400,
        'msg' => 'Ocurrio un error vuelve a intentarlo mas tarde'
    ];
    print_r(json_encode($resp));
    http_response_code(400);
   } else {
    if($amount === '') {
        $resp = [
            'code'=> 400,
            'msg' => 'Todos los datos son obligatorios'
        ];
        print_r(json_encode($resp));
        http_response_code(400);
    } else {
        if(floatval($amount) <= 0) {
            $resp = [
                'code'=> 400,
                'msg' => 'La cantidad a pagar es obligaria y tiene que ser mayor a 0'
            ];
            print_r(json_encode($resp));
            http_response_code(400);
            return;
        }
      
       $query = "SELECT pagosRealizados, totalDeVenta, cantidadPagada, cantidadPagos, formaPago  FROM ventas WHERE idVenta = '$idSale'";
       $response = $db->query($query);
       $dataSale = $response->fetch_assoc();;
       $paymentsMade = $dataSale['pagosRealizados'];
       $totalSale = $dataSale['totalDeVenta'];
       $amountPaid = $dataSale['cantidadPagada'];
       $amoundPayments = $dataSale['cantidadPagos'];
       $wayToPay = $dataSale['formaPago'];

       $query = "SELECT cantidadPago FROM pagos WHERE idPago = '$idPayment'";
       $resp = $db ->query($query);
       $amoundPaymentPrevius =  $resp->fetch_assoc()['cantidadPago'] ;
    
       $amountPaid = floatval($amountPaid) - $amoundPaymentPrevius; 

       
       
       

       if((floatval($amountPaid) + floatval($amount)) > floatval($totalSale)) {
        $response = [
            'code'=> 400,
            'msg' => 'La cantidad pagada exedera la cantidad total de la venta'
        ];
        
        print_r(json_encode($response));
        http_response_code(400);
        return;
       }

      
       if(intval($wayToPay) === 1 && floatval($amount) !== floatval($totalSale)) {
        $response = [
            'code'=> 400,
            'msg' => 'La forma de pago es al contado asi que se debe pagar la cantidad total'
        ];
        
        print_r(json_encode($response));
        http_response_code(400);
        return;
       } 

      



      if((floatval($amount) + $amountPaid) == $totalSale) {
        $paymentsMade = $amoundPayments;
      } 

      $amountPaid += floatval($amount); 

        $query = "UPDATE ventas SET  cantidadPagada='$amountPaid', cantidadPagos = '$amoundPayments' WHERE idVenta='$idSale'";
        $result = $db->query($query);

        $query  = "UPDATE  pagos SET cantidadPago = '$amount' WHERE idPago = '$idPayment'";
        $result = $db->query($query);

        if ($result) {
            $resp = [
              "code" => 200,
              "msg" => "Pago actualizado  correctamente"
            ];
            print_r(json_encode($resp));
            http_response_code(200);
          } else {
            $resp = [
                "code" => 400,
                "msg" => "No se pudo actualizar el pago vuelva a intentarlo mas tarde",
              ];
              print_r(json_encode($resp));
              http_response_code(200);
          }
    }
   }
}
