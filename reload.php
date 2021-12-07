<?php
    session_start();

    require_once('const.php');
    require_once('env.php');
    require_once('api.php');

    if (!canPlay()) {
        echo 'error!';
        exit;
    }

    $request = json_decode(file_get_contents("php://input"), true);

    $x = $request["x"];
    $y = $request["y"];

    header("Location:othello.php");
    exit;
?>
