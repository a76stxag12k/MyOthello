<?php
    session_start();

    $request = json_decode(file_get_contents("php://input"), true);

    $x = $request["x"];
    $y = $request["y"];

    header("Location:othello.php");
    exit;
?>
