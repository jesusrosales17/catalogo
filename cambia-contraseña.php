<?php
require_once "config/db.php";
require_once "functions/isAuth.php";

isAuth();
$errors = [];

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idUser = $_SESSION['id'];
    
    $db = connectDB();

    $newPassword = trim( $db-> escape_string($_POST["newPassword"]));
    $password = trim( $db->escape_string($_POST["password"]));

    if(!$newPassword || !$password) {
        array_push($errors, "Todos los campos son obligatorios");
    }
    $query = 'SELECT password FROM usuarios WHERE idUsuario = ' . $idUser;
    $result = $db->query($query);
    $user = $result->fetch_assoc();
    $auth = password_verify($password, $user["password"]);

    if($auth) {
        $newPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $query = "UPDATE usuarios SET password = '$newPassword' WHERE idUsuario = $idUser";
        $res = $db->query($query);
        if($res) {
            header("Location: index.php");
        } else {
            array_push($errors, "No se puedo actualizar la contraseña");
        }

    } else {
        array_push($errors, "La contraseña actual es incorrecta");
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambiar contraseña</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/contraseña.css">
</head>

<body>
    
    <img src="./images/flor.png" alt="flor" class="flor flor--2">
    

    <main class="panel updatePassword">
        <?php include('./template/menu.php') ?>

        <form class="form container" method="POST">
            <h1 class="form__title">Cambiar contraseña</h1>
        <?php if(!empty($errors)): ?>
                <div class="alert">
                    <p class="alert__text"> <?php echo $errors[0] ?> </p>
                </div>
            <?php endif; ?>

            <div class="form__item">
                <label for="password" class="form__label">Contraseña actual: </label>
                <input type="password" name="password" id="password" class="form__input">
            </div>
            <div class="form__item">
                <label for="newPassword" class="form__label">Nueva contraseña: </label>
                <input type="password" name="newPassword" id="newPassword" class="form__input">
            </div>

            <input type="submit" value="Cambiar contraseña" class="form__submit">
        </form>
    </main>

</body>

</html>