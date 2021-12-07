<?php
    session_start();

    require_once('const.php');
    require_once('env.php');
    require_once('api.php');

    if (!canPlay()) {
        echo 'error!';
        exit;
    }

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
            // $dbh = null;

            $sql  = "delete from game_result ";
            $sql .= "where ";
            $sql .= "    not exists( ";
            $sql .= "        select * from (select * from game_result t2 order by t2.reg_dt desc limit 10) t3 ";
            $sql .= "        where game_result.id = t3.id ";
            $sql .= "    )";

            try {
                // $dbh = new PDO($dsn, $user, $password);
                $stmt = $dbh->prepare($sql);
                $stmt->execute();
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
