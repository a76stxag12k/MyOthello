<?php
    session_start();

    if (!array_key_exists('myname', $_POST)) {
        echo 'error!';
        exit;
    }
    if (strlen($_POST['myname']) == 0) {
        echo 'error!';
        exit;
    }

    $_SESSION['myname'] = $_POST['myname'];

    header("Location:othello.php");
    exit;
?>
