<?php
require_once('../config/db.php');
require_once('../functions/isAuth.php');
isAuth();

$db = connectDB();



if($_SERVER['REQUEST_METHOD']  === 'POST') {
    $idSale = trim($db->escape_string($_POST['idSale']));
    $amount = trim($db->escape_string($_POST['amount']));


   if(!$idSale) {
    $resp = [
        'code'=> 400,
        'msg' => 'Ocurrio un error vuelve a intentarlo mas tarde'
    ];
    print_r(json_encode($resp));
    http_response_code(400);
   } else {
    if(!$amount) {
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

       if(floatval($amount) > floatval($totalSale)) {
        $response = [
            'code'=> 400,
            'msg' => 'La cantidad a pagar no puede ser mayor al total de la venta'
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
       } else {
        if((intval($paymentsMade) + 1) === intval($amoundPayments) && (floatval($amountPaid) + floatval($amount)) !== floatval($totalSale)) {
            
            $response = [
                'code'=> 400,
                'msg' => 'Al ser el ultimo pago se debe de terminar de pagar la cantidad acordada, si quiere agregar mas pagos edite la venta'
            ];
            
            print_r(json_encode($response));
            http_response_code(400);
            return;
        }
       }



      if((floatval($amount) + $amountPaid) == $totalSale) {
        $paymentsMade = $amoundPayments;
      } else {
        $paymentsMade += 1;
      }

      $amountPaid += floatval($amount); 

        $query = "UPDATE ventas SET pagosRealizados = $paymentsMade, cantidadPagada='$amountPaid', cantidadPagos = '$amoundPayments' WHERE idVenta='$idSale'";
        $result = $db->query($query);

        if ($result) {
            $resp = [
              "code" => 200,
              "msg" => "Pago registrado  correctamente"
            ];
            print_r(json_encode($resp));
            http_response_code(200);
          } else {
            $resp = [
                "code" => 400,
                "msg" => "No se pudo registrar el pago vuelva a intentarlo mas tarde",
              ];
              print_r(json_encode($resp));
              http_response_code(200);
          }
    }
   }
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {

        $query = "SELECT * FROM pagos";
        $resp =  $db->query($query);


        $data = [];
        while ($row = $resp->fetch_assoc()) {
            $data[] = $row;
        }
        
        print_r(json_encode($data));
        http_response_code(200);
    

}
