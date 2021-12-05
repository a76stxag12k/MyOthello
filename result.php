<?php
    session_start();

    require('const.php');

    $ret = "ok!";
    $logName = 'othello.log';

    try {
        $request = json_decode(file_get_contents("php://input"), true);

        if (!isset($_SESSION['myname'])) {
            // error!
            $ret = 'error!';
            throw 'parameter error!';
        }
        else if ($_SESSION['myname'] != $request["name"]) {
            // error!
            $ret = 'error!';
            throw 'parameter error!';
        }
        else {
            $name      = $request["name"];
            $color     = $request["color"];
            $result    = $request["result"];
            $white     = $request["white"];
            $black     = $request["black"];
        
            $sql  = "INSERT INTO game_result(";
            $sql .= "    name,";
            $sql .= "    color,";
            $sql .= "    result,";
            $sql .= "    white,";
            $sql .= "    black,";
            $sql .= "    reg_dt";
            $sql .= ") VALUES (";
            $sql .= "    ".":name".",";
            $sql .= "    ".":color".",";
            $sql .= "    ".":result".",";
            $sql .= "    ".":white".",";
            $sql .= "    ".":black".",";
            $sql .= "    SYSDATE()";
            $sql .= ");";
        
            $dsn = 'mysql:dbname=othello;host=localhost';
            $user = 'testuser';
            $password = 'testuser';
            // $dbh = null;
            // $stmt = null;
            
            try {

                $dbh = new PDO($dsn, $user, $password);
                $stmt = $dbh->prepare($sql);
                $stmt->execute(array(':name'    => $name,
                                     ':color'   => $color,
                                     ':result'  => $result,
                                     ':white'   => $white,
                                     ':black'   => $black));
            }
            catch (PDOException $e) {
                $ret = "db error!";
                $log = 'Error:'.$e->getMessage() .PHP_EOL;
                file_put_contents($logName, $log, FILE_APPEND | LOCK_EX);
                // die();
            }
            $stmt = null;
            $dbh = null;
        }
    }
    catch (Exception $err) {
        $ret = "error!";
        $log = 'Error:'.$err->getMessage() .PHP_EOL;
        file_put_contents($logName, $log, FILE_APPEND | LOCK_EX);
    }

    $result = [
        "return" => $ret,
    ];

    $json = json_encode($result, JSON_UNESCAPED_UNICODE);
    header("Content-Type: application/json; charset=UTF-8");
    echo $json;
    exit;
?>
