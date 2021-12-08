<?php
	session_start();

    require_once('const.php');
    require_once('env.php');
    require_once('api.php');

    if (!canPlay()) {
        echo 'error!';
        exit;
    }
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/styles.css">
    <title>Battle Record</title>
</head>
<body>

    <div class="ttitle">ëŒêÌåãâ </div>
    <table border="1" class="brtable">
        <thead>
            <th>No.</th>
            <th>ñºëO</th>
            <th>é©êF</th>
            <th>èüîs</th>
            <th>îí</th>
            <th>çï</th>
            <th>ì˙éû</th>
        </thead>
        <tbody>
<?php

    $ret = "ok!";
    $logName = 'othello.log';

    $sql = "select * from game_result order by 1 desc";

    $dbh = null;
    $stmt = null;

    try {
        $dbh = new PDO($dsn, $user, $password);
        $stmt = $dbh->prepare($sql);
        $stmt->execute();

        foreach($stmt as $row){

            echo '            <tr>'.PHP_EOL;

            echo '                <td align="center">'.PHP_EOL;
            echo '                    '.$row['id'].PHP_EOL;
            echo '                </td>'.PHP_EOL;

            echo '                <td>'.PHP_EOL;
            echo '                    '.$row['name'].PHP_EOL;
            echo '                </td>'.PHP_EOL;

            echo '                <td align="center">'.PHP_EOL;
            echo '                    '.$row['color'].PHP_EOL;
            echo '                </td>'.PHP_EOL;

            echo '                <td align="center">'.PHP_EOL;
            echo '                    '.$row['result'].PHP_EOL;
            echo '                </td>'.PHP_EOL;

            echo '                <td align="center">'.PHP_EOL;
            echo '                    '.$row['white'].PHP_EOL;
            echo '                </td>'.PHP_EOL;

            echo '                <td align="center">'.PHP_EOL;
            echo '                    '.$row['black'].PHP_EOL;
            echo '                </td>'.PHP_EOL;

            echo '                <td align="center">'.PHP_EOL;
            echo '                    '.$row['reg_dt'].PHP_EOL;
            echo '                </td>'.PHP_EOL;

            echo '            </tr>'.PHP_EOL;
        }
    }
    catch (PDOException $e) {
        $ret = "db error!";
        $log = 'Error:'.$e->getMessage() .PHP_EOL;
        file_put_contents($logName, $log, FILE_APPEND | LOCK_EX);
        // die();
    }

    $stmt = null;
    $dbh = null;
?>
        </tbody>
    </table>
    <div class="btn_back">
        <button onclick="location.href='./othello.php'">ñﬂÇÈ</button>
    </div>

</body>
</html>