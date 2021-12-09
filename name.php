<?php
    session_start();

    require_once('const.php');
    require_once('env.php');
    require_once('api.php');

    if (!array_key_exists('myid', $_POST)) {
        echo 'error!';
        exit;
    }
    if (!array_key_exists('mypw', $_POST)) {
        echo 'error!';
        exit;
    }
    if (!array_key_exists('myname', $_POST)) {
        echo 'error!';
        exit;
    }
    if (strlen($_POST['myname']) == 0) {
        echo 'error!';
        exit;
    }

    if (strlen($_POST['myname']) > 20) {
        echo 'error!';
        exit;
    }

    $_SESSION['myid'] = $_POST['myid'];
    $_SESSION['mypw'] = $_POST['mypw'];
    $_SESSION['myname'] = $_POST['myname'];

    if (!canPlay()) {
        echo 'error!';
        exit;
    }

    header("Location:othello.php");
    exit;
?>
