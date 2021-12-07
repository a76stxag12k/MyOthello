<?php
    require_once('const.php');
    require_once('env.php');

    function canPlay() {

        // ID チェック
        if (!isset($_SESSION['myid']) || strlen($_SESSION['myid']) == 0) {
            return false;
        }
        
        // パスワード チェック
        if (!isset($_SESSION['mypw']) || strlen($_SESSION['mypw']) == 0) {
                return false;
        }

        // 名前 チェック
        if (!isset($_SESSION['myname']) || strlen($_SESSION['myname']) == 0) {
                return false;
        }

        // ユーザー & パスワード 値 チェック
        if ($_SESSION['myid'] != username || $_SESSION['mypw'] != userpw) {
            return false;
        }

        return true;
    }


?>