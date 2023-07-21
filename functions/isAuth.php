<?php
    function isAuth() {
        session_start();

        if(!isset($_SESSION['login']) || $_SESSION['login'] != true ) {
            header('Location: /login.php');
        } 
        if(isset($_SESSION['rol']) && $_SESSION['rol'] != 0 ) {
            header('Location: /login.php');
        }
    }
?>