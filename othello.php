<?php
	session_start();
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/styles.css">
    <title>My Game</title>
</head>
<body>
    <div class="gameinfo">
        白：
        <div id="whiteNumber" class="count">0</div>
        <div id="board" class="bord"></div>
        黒：
        <div id="blackNumber" class="count">0</div>
    </div>
    <div id="boxs">
        <div class="box" id="skip">skip</div>
        <div class="box" id="reset">reset</div>
    </div>
    <script src="js/constants.js"></script>
    <script src="js/global.js"></script>
    <script src="js/board.js"></script>
    <script src="js/renderer.js"></script>
    <script src="js/game.js"></script>
    <script src="js/main.js"></script>

<?php
    echo '    <script>'.PHP_EOL;
    echo '        console.log("My Name is '.htmlspecialchars($_SESSION['myname']).'")'.PHP_EOL;
    echo '        myname = "'.htmlspecialchars($_SESSION['myname']).'"'.PHP_EOL;
    echo '    </script>'.PHP_EOL;
?>
</body>
</html>
