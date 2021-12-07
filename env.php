<?php

    // for local
    define('dbhost', 'localhost');
    define('dbname', 'othello');
    define('dbuser', 'testuser');
    define('dbpwd', 'testuser');
    define('username', 'guest');
    define('userpw', 'guest');

    $dsn = 'mysql:dbname='.dbname.';'.'host='.dbhost;
    $user = dbuser;
    $password = dbpwd;
?>
