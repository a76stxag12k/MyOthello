function getOppColor() {
    return (myColor === pWhite ? pBlack: pWhite);
}

var state = [];
var squareContainer;
var isMyTurn = true;

function countPiace() {
    // let whiteNumber = 0;
    // let blackNumber = 0;
    // for (let x = 0; x < squareNum; x++) {
    //     for (let y = 0; y < squareNum; y++) {
    //         if (state[y][x] !== pNothing) {
    //             if (state[y][x]  === pWhite) {
    //                 whiteNumber++;
    //             } else if (state[y][x]  === pBlack) {
    //                 blackNumber++;
    //             }
    //         }
    //     }
    // }

    const whiteNumber = state.flat().map((piece) => piece === pWhite).reduce((acc, cur) => acc + cur, 0);
    const blackNumber = state.flat().map((piece) => piece === pBlack).reduce((acc, cur) => acc + cur, 0);
    
    let whiteElement = document.getElementById('whiteNumber');
    whiteElement.textContent = whiteNumber;

    let blackElement = document.getElementById('blackNumber');
    blackElement.textContent = blackNumber;
}

function turnPiece(x, y) {
    if (state.length <= y) {
        return;
    }
    if (state[y].length <= x) {
        return;
    }
    if (state[y][x] !== pNothing) {
        state[y][x] = state[y][x] === pWhite ? pBlack : pWhite;
    }
}

function putMyPiece(x, y) {
    if (state.length <= y) {
        return;
    }
    if (state[y].length <= x) {
        return;
    }

    if (state[y][x] === 0) {
        state[y][x] = myColor;
    }
}

async function oppTurn() {
    for (let y = 0; y < squareNum; y++) {
        for (let x = 0; x < squareNum; x++) {
            if (canTurn(x, y, getOppColor(), myColor, true)) {
                putOppPiece(x, y);
                turnPieceAll(x, y, getOppColor(), myColor);
                await drawBorad();
                if (!canContinue(!isFinished)) {
                    if (!isFinished) {
                        isFinished = true;
                        fin();
                    }
                    console.log('終了');
                }
                isMyTurn = true;
                return;
            }
        }
    }

    console.log('相手の打つ場所がない');
    alert('打つ場所がありません！')

    if (!canContinue(true)) {
        // console.log('継続できない');
        if (!isFinished) {
            isFinished = true;
            fin();
        }
        console.log('終了');
    }
    isMyTurn = true;
}

function putOppPiece(x, y) {

    if (state.length <= y) {
        return;
    }
    if (state[y].length <= x) {
        return;
    }

    if (state[y][x] === 0) {
        state[y][x] = getOppColor();
    }
}

function canTurn(xPos, yPos, targetColor, opponentColor) {
    return checkPieceAll(xPos, yPos, targetColor, opponentColor);
}

function turnPieceAll(xPos, yPos, targetColor, opponentColor) {

    if (targetColor === opponentColor) {
        return;
    }

    // 右
    rightChange(xPos, yPos, targetColor);

    // 左
    leftChange(xPos, yPos, targetColor);

    // 上
    topChange(xPos, yPos, targetColor);

    // 下
    bottomChange(xPos, yPos, targetColor);

    // 右上
    rightTopChange(xPos, yPos, targetColor);

    // 右下
    rightBottomChange(xPos, yPos, targetColor);

    // 左上
    leftTopChange(xPos, yPos, targetColor);

    // 左下
    leftBottomChange(xPos, yPos, targetColor);

}

// チェック
function checkPieceAll(xPos, yPos, targetColor, opponentColor) {

    if (targetColor === opponentColor) {
        return false;
    }

    if (state[(yPos - 0)][(xPos - 0)] !== pNothing) {
        return false;
    }

    // 右
    let canTurnRight = checkRight(xPos, yPos, targetColor);

    // 左
    let canTurnLeft = checkLeft(xPos, yPos, targetColor);

    // 上
    let canTurnTop = checkTop(xPos, yPos, targetColor);

    // 下
    let canTurnBottom = checkBottom(xPos, yPos, targetColor);

    // 右上
    let canTurnRightTop = checkRightTop(xPos, yPos, targetColor);

    // 右下
    let canTurnRightBottom = checkRightBottom(xPos, yPos, targetColor);

    // 左上
    let canTurnLeftTop = checkLeftTop(xPos, yPos, targetColor);

    // 左下
    let canTurnLedtBottom = checkLeftBottom(xPos, yPos, targetColor);

    let canTurn = false;

    if (canTurnRight || canTurnLeft ||
        canTurnTop || canTurnBottom ||
        canTurnRightTop || canTurnRightBottom ||
        canTurnLeftTop || canTurnLedtBottom) {
        canTurn = true;
    }

    return canTurn;
}

// 次の駒を置けるか？
function canContinue(isAlert) {
    if (!canMyContinue() && !canOppContinue()) {
        if (isAlert) {
            alert('置ける場所がありません。ゲーム終了です！');
        }
        return false;
    }
    return true;
}

// 自分が次の駒を置けるか？
function canMyContinue() {
    for (let y = 0; y < squareNum; y++) {
        for (let x = 0; x < squareNum; x++) {
            if (checkPieceAll(x, y, myColor, getOppColor())) {
                return true;
            }
        }
    }
    console.log('打つ場所がない');
    return false;
}

// プログラムが次の駒を置けるか？
function canOppContinue() {
    for (let y = 0; y < squareNum; y++) {
        for (let x = 0; x < squareNum; x++) {
            if (checkPieceAll(x, y, getOppColor(), myColor)) {
                return true;
            }
        }
    }
    console.log('プログラムの打つ場所がない');
    return false;
}

// 初期化
async function init() {
	setSkipEvent();
	setResetEvent();
    setListEvent();

    createBorad();
    initializeBorad();
    await drawBorad();
}

// スキップボタンイベント
function setSkipEvent()
{
    const es = document.getElementById('skip');
    es.addEventListener('click', () => {
        console.log('skip');
        isMyTurn = false;
        oppTurn();
    });
}

// リセットボタンイベント
function setResetEvent()
{
    const er = document.getElementById('reset');
    er.addEventListener('click', () => {
        window.location.href = 'reload.php';
    });
}

// リスト(対戦成績)ボタンイベント
function setListEvent()
{
    const er = document.getElementById('list');
    er.addEventListener('click', () => {
        window.location.href = 'list.php';
    });
}

// DB に結果登録
function fin() {


    const whiteNumber = state.flat().map((piece) => piece === pWhite).reduce((acc, cur) => acc + cur, 0);
    const blackNumber = state.flat().map((piece) => piece === pBlack).reduce((acc, cur) => acc + cur, 0);
    const colorName = (myColor === pWhite) ? "white" : "black";

    var result = "";
    if (whiteNumber === blackNumber) {
        result = "Draw";
    }
    else if (whiteNumber > blackNumber) {
        result = (myColor === pWhite) ? "Win" : "Lose";
    }
    else {
        result = (myColor === pWhite) ? "Lose" : "Win";
    }

    var data = {
        "name"      : myname,
        "color"     : colorName,
        "result"    : result,
        "white"     : whiteNumber,
        "black"     : blackNumber,
    }

    // 非同期
    var json = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    console.log(json);

    xhr.open("POST", "result.php");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.timeout = 2000;
    xhr.send(json);
    xhr.onreadystatechange = () => {
        try {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var result = JSON.parse(xhr.response);
                    console.log(xhr.response);
                }
            }
        } catch (e) {
            // 例外
            console.log('例外:' + e.message);
        }
    };

    console.log('終了!');
}
