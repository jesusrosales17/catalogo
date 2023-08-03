<?php
require_once "config/db.php";
$errors = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $db = connectDB();

    $email = trim($db->escape_string($_POST["email"]));
    $password = trim($db->escape_string($_POST["password"]));

    if (!$email || !$password) {
        array_push($errors, "Todos los campos son obligatorios");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        array_push($errors, "El email no es valido");
    }

    if (empty($errors)) {
        $query = "SELECT * FROM usuarios WHERE email = '$email'";
        $resultUsers = $db->query($query);

        $query2 = "SELECT * FROM backup WHERE email = '$email'";
        $resultBackup = $db->query($query2);


        if ($resultUsers->num_rows || $resultBackup->num_rows) {
            if($resultUsers->num_rows) {
                $user = $resultUsers->fetch_assoc();
            } else {
                $user = $resultBackup->fetch_assoc();
            }
            if(isset($user['activo']) && $user['activo'] == 0) {
                array_push($errors, "El usuario no esta activo");
                
            } else {
                $auth = password_verify($password, $user["password"]);
    
                if ($auth) {
                    session_start();
                    $_SESSION["login"] = true;
                    $_SESSION["user"] = $user["email"];
                    $_SESSION["id"] = $user["idUsuario"];
                    $_SESSION["name"] = $user["nombre"];
                   
                    if (isset($user["rol"])) {
                        $_SESSION["rol"] = $user["rol"];
                        header("Location: /admin/index.php");
                    } else {
                        header("Location: index.php");
                    }
    
                } else {
                    array_push($errors, "La contraseña es incorrecta");
                }
            }
           
        } else {
            array_push($errors, "El usuario no existe");
        }
    }
}


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/login.css">
</head>

<body>
    <main class="login panel">
        <img src="./images/flor.png" alt="flor" class="flor flor--1">
        <img src="./images/flor.png" alt="flor" class="flor flor--2">
        <form class="form" method="POST">
            <?php if (!empty($errors)) : ?>
                <div class="alert">
                    <p class="alert__text"> <?php echo $errors[0] ?> </p>
                </div>
            <?php endif; ?>
            <h2 class="form__title">Login</h2>

            <div class="form__item">
                <input type="text" class="form__input" placeholder="Correo" id="email" name="email" required>
            </div>

            <div class="form__item">
                <input type="password" class="form__input" placeholder="password" id="password" name="password" required>
            </div>

            <div class="form__item">
                <input type="submit" class="form__submit" value="Iniciar Sesión">
            </div>
        </form>
    </main>
</body>

</html>