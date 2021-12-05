function createBorad() {
    const board = document.getElementById('board');
    squareContainer = document.createElement('div');
    squareContainer.className = 'square-container';

    for (let idx = 0; idx < squareNum; idx++) {
        state.push(Array(squareNum).fill(0));
    }
    for (let i = 0; i < squareNum; i++) {
        var squareRowContainer = document.createElement('div');
        squareRowContainer.className = 'square-row-container';
        for (let j = 0; j < squareNum; j++) {
            var squareCol = document.createElement('div');
            squareCol.classList.add('square');
            squareCol.classList.add('square-top');
            squareCol.classList.add('square-left');
            if (j === (squareNum - 1)) {
                squareCol.classList.add('square-right');
            }
            if (i === (squareNum - 1)) {
                squareCol.classList.add('square-bottom');
            }

            squareCol.addEventListener('click', listener, false);
            squareCol.id = "row-" + i + "-" + j;
            squareRowContainer.appendChild(squareCol);

            var pic = document.createElement('div');
            pic.className = 'piece';
            pic.id = 'pic-' + i + '-' + j;

            var pic_w = document.createElement('div');
            pic_w.className = 'piece-white';
            pic_w.id = 'p-w-' + i + '-' + j;
            var pic_b = document.createElement('div');
            pic_b.className = 'piece-black';
            pic_b.id = 'p-b-' + i + '-' + j;

            pic.appendChild(pic_w);
            pic.appendChild(pic_b);
            pic.style.display = 'none';
            squareCol.appendChild(pic);
        }
        squareContainer.appendChild(squareRowContainer)
    }
    board.appendChild(squareContainer);
}

// 盤面初期化
function initializeBorad() {

    const isDebug = false;
    const isMyDebug = false;

    for (let i = 0; i < squareNum; i++) {
        for (let j = 0; j < squareNum; j++) {
            if (!isDebug) {
                if (squareNum / 2 === i && squareNum / 2 === j) {
                    putMyPiece(i-1, j-1);
                    putOppPiece(i-1, j);
                    putOppPiece(i, j-1);
                    putMyPiece(i, j);
                }
            }
            else {
                // putMyPiece(i, j);
                if (squareNum === (i + 1) && squareNum === (j + 1)) {
                    if (isMyDebug) {
                        putMyPiece(i, j);
                    }
                    else {
                        putOppPiece(i, j);
                    }
                }
                else if (squareNum === (i + 3) && squareNum === (j + 1)) {
                    // if (isMyDebug) {
                    //     putMyPiece(i, j);
                    // }
                    // else {
                    //     putOppPiece(i, j);
                    // }
                }
                else {
                    if (isMyDebug) {
                        putOppPiece(i, j);
                    }
                    else {
                        putMyPiece(i, j);
                    }
                }
            }
        }
    }
}

// リスナー
async function listener(e) {
    if (isMyTurn === false) {
        return;
    }

    if (!canContinue(true)) {
        console.log('打つ場所がないのでゲーム終了!');
        return;
    }

    let pos = e.target.id.substring(4);
    let row = pos.split('-');
    let y = row[0];
    let x = row[1];
    if (state.length <= y) {
        return;
    }
    if (state[y].length <= x) {
        return;
    }

    if (!canTurn(x, y, myColor, getOppColor())) {
        return;
    }

    isMyTurn = false;

    putMyPiece(x, y);

    turnPieceAll(x, y, myColor, getOppColor());

    await drawBorad();

    // 相手のターン
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            oppTurn();
            resolve();
            // reject();
        }, 1000);
    });
}

// 右チェック
function checkRight(xPos, yPos, targetColor) {
    return checkRightWithTurn(xPos, yPos, targetColor, false);
}

// 右反転
function rightChange(xPos, yPos, targetColor) {
    return checkRightWithTurn(xPos, yPos, targetColor, true);
}

// 右チェック＆反転
function checkRightWithTurn(xPos, yPos, targetColor, isTurn) {

    let changePos = 0;

    // 端の場合は中止
    if ((xPos - 0) === (squareNum - 1)) {
        return false;
    }

    // 端より1個手前は中止
    if ((xPos - 0) === (squareNum - 2)) {
        return false;
    }

    // 隣に駒がない場合は中止
    if (state[(yPos - 0)][((xPos - 0) + 1)] === pNothing) {
        return false;
    }

    // 隣が同じ色の場合は中止
    if (state[(yPos - 0)][((xPos - 0) + 1)] === targetColor) {
        return false;
    }

    // 隣が違う色の時に続けて調べていく
    for (let l = ((xPos - 0) + 1); l < squareNum; l++) {
        if (state[(yPos - 0)][l] === targetColor) {
            break;
        }
        if (state[(yPos - 0)][l] === pNothing) {
            return false;
        }
        changePos = l;
    }

    // 端まで同じ色の場合中止
    if (changePos === (squareNum - 1)) {
        return false;
    }

    if (isTurn) {
        for (let j = (xPos - 0); j <= changePos; j++) {
            // 色を変える
            state[(yPos - 0)][j] = targetColor;
        }
    }

    return true;
}


// 左チェック
function checkLeft(xPos, yPos, targetColor) {
    return checkLeftWithTurn(xPos, yPos, targetColor, false);
}

// 左反転
function leftChange(xPos, yPos, targetColor) {
    return checkLeftWithTurn(xPos, yPos, targetColor, true);
}

// 左チェック＆反転
function checkLeftWithTurn(xPos, yPos, targetColor, isTurn) {

    let changePos = 0;

    // 端の場合は中止
    if ((xPos - 0) === 0) {
        return false;
    }

    // 端より1個手前は中止
    if ((xPos - 0) === 1) {
        return false;
    }

    // 隣に駒がない場合は中止
    if (state[(yPos - 0)][((xPos - 0) - 1)] === pNothing) {
        return false;
    }

    // 隣が同じ色の場合は中止
    if (state[(yPos - 0)][((xPos - 0) - 1)] === targetColor) {
        return false;
    }

    // 隣が違う色の時に続けて調べていく
    for (let l = ((xPos - 0) - 1); l >= 0; l--) {
        if (state[(yPos - 0)][(l - 0)] === targetColor) {
            break;
        }
        if (state[(yPos - 0)][(l - 0)] === pNothing) {
            return false;
        }
        changePos = (l - 0);
    }

    // 端まで同じ色の場合中止
    if (changePos === 0) {
        return false;
    }

    if (isTurn) {
        for (let j = (xPos - 0); j >= changePos; j--) {
            // 色を変える
            state[(yPos - 0)][j] = targetColor;
        }
    }

    return true;
}

// 上チェック
function checkTop(xPos, yPos, targetColor) {
    return checkTopWithTurn(xPos, yPos, targetColor, false);
}

// 上反転
function topChange(xPos, yPos, targetColor) {
    return checkTopWithTurn(xPos, yPos, targetColor, true);
}

// 上チェック＆反転
function checkTopWithTurn(xPos, yPos, targetColor, isTurn) {

    let changePos = 0;

    // 端の場合は中止
    if ((yPos - 0) === 0) {
        return false;
    }

    // 端より1個手前は中止
    if ((yPos - 0) === 1) {
        return false;
    }

    // 隣に駒がない場合は中止
    if (state[((yPos - 0) - 1)][(xPos - 0)] === pNothing) {
        return false;
    }

    // 隣が同じ色の場合は中止
    if (state[((yPos - 0) - 1)][(xPos - 0)] === targetColor) {
        return false;
    }

    // 隣が違う色の時に続けて調べていく
    for (let l = ((yPos - 0) - 1); l >= 0; l--) {
        if (state[(l - 0)][(xPos - 0)] === targetColor) {
            break;
        }
        if (state[(l - 0)][(xPos - 0)] === pNothing) {
            return false;
        }
        changePos = l;
    }

    // 端まで同じ色の場合中止
    if (changePos === 0) {
        return false;
    }

    if (isTurn) {
        for (let j = (yPos - 0); j >= changePos; j--) {
            // 色を変える
            state[j][(xPos - 0)] = targetColor;
        }
    }

    return true;
}

// 下チェック
function checkBottom(xPos, yPos, targetColor) {
    return checkBottomWithTurn(xPos, yPos, targetColor, false);
}

// 下反転
function bottomChange(xPos, yPos, targetColor) {
    return checkBottomWithTurn(xPos, yPos, targetColor, true);
}

// 下チェック＆反転
function checkBottomWithTurn(xPos, yPos, targetColor, isTurn) {

    let changePos = 0;

    // 端の場合は中止
    if ((yPos - 0) === (squareNum - 1)) {
        return false;
    }

    // 端より1個手前は中止
    if ((yPos - 0) === (squareNum - 2)) {
        return false;
    }

    // 隣に駒がない場合は中止
    if (state[((yPos - 0) + 1)][(xPos - 0)] === pNothing) {
        return false;
    }

    // 隣が同じ色の場合は中止
    if (state[((yPos-0) + 1)][(xPos - 0)] === targetColor) {
        return false;
    }

    // 隣が違う色の時に続けて調べていく
    for (let l = ((yPos - 0) + 1); l < squareNum; l++) {
        if (state[(l - 0)][(xPos - 0)] === targetColor) {
            break;
        }
        if (state[(l - 0)][(xPos - 0)] === pNothing) {
            return false;
        }
        changePos = l;
    }

    // 端まで同じ色の場合中止
    if (changePos === (squareNum - 1)) {
        return false;
    }

    if (isTurn) {
        for (let j = (yPos - 0); j <= changePos; j++) {
            // 色を変える
            state[(j - 0)][(xPos - 0)] = targetColor;
        }
    }

    return true;
}

// 右上チェック
function checkRightTop(xPos, yPos, targetColor) {
    return checkRightTopWithTurn(xPos, yPos, targetColor, false);
}

// 右上反転
function rightTopChange(xPos, yPos, targetColor) {
    return checkRightTopWithTurn(xPos, yPos, targetColor, true);
}

// 右上チェック＆反転
function checkRightTopWithTurn(xPos, yPos, targetColor, isTurn) {

    let changePosX = 0;
    let changePosY = 0;

    // 端の場合は中止
    if (((xPos - 0) === (squareNum - 1)) || ((yPos - 0) === 0)) {
        return false;
    }

    // 端より1個手前は中止
    if (((xPos - 0) === (squareNum - 2)) || ((yPos - 0) === 1)) {
        return false;
    }

    // 隣に駒がない場合は中止
    if (state[((yPos - 0) - 1)][(xPos - 0) + 1] === pNothing) {
        return false;
    }

    // 隣が同じ色の場合は中止
    if (state[((yPos - 0) - 1)][(xPos - 0) + 1] === targetColor) {
        return false;
    }

    // 隣が違う色の時に続けて調べていく
    for (let lx = ((xPos - 0) + 1), ly = ((yPos - 0) - 1); (lx < squareNum) && (ly >= 0); lx++, ly--) {
        if (state[ly][lx] === targetColor) {
            break;
        }
        if (state[ly][lx] === pNothing) {
            return false;
        }
        changePosX = lx;
        changePosY = ly;
    }

    // 端まで同じ色の場合中止
    if ((changePosX === (squareNum - 1)) || (changePosY === 0)) {
        return false;
    }

    if (isTurn) {
        for (let jx = (xPos - 0), jy = (yPos - 0); (jx <= changePosX) && (jy >= changePosY); jx++, jy--) {
            // 色を変える
            state[jy][jx] = targetColor;
        }
    }

    return true;
}

// 右下チェック
function checkRightBottom(xPos, yPos, targetColor) {
    return checkRightBottomWithTurn(xPos, yPos, targetColor, false);
}

// 右下反転
function rightBottomChange(xPos, yPos, targetColor) {
    return checkRightBottomWithTurn(xPos, yPos, targetColor, true);
}

// 右下チェック＆反転
function checkRightBottomWithTurn(xPos, yPos, targetColor, isTurn) {

    let changePosX = 0;
    let changePosY = 0;

    // 端の場合は中止
    if (((xPos - 0) === (squareNum - 1)) || ((yPos - 0) === (squareNum - 1))) {
        return false;
    }

    // 端より1個手前は中止
    if (((xPos - 0) === (squareNum - 2)) || ((yPos - 0) === (squareNum - 2))) {
        return false;
    }

    // 隣に駒がない場合は中止
    if (state[((yPos - 0) + 1)][((xPos - 0) + 1)] === pNothing) {
        return false;
    }

    // 隣が同じ色の場合は中止
    if (state[((yPos - 0) + 1)][((xPos - 0) + 1)] === targetColor) {
        return false;
    }

    // 隣が違う色の時に続けて調べていく
    for (let lx = ((xPos - 0) + 1), ly = ((yPos - 0) + 1); (lx < squareNum) && (ly < squareNum); lx++, ly++) {
        if (state[(ly - 0)][(lx - 0)] === targetColor) {
            break;
        }
        if (state[(ly - 0)][(lx - 0)] === pNothing) {
            return false;
        }
        changePosX = lx;
        changePosY = ly;
    }

    // 端まで同じ色の場合中止
    if ((changePosX === (squareNum - 1)) || (changePosY === (squareNum - 1))) {
        return false;
    }

    if (isTurn) {
        for (let jx = (xPos - 0), jy = (yPos - 0); (jx <= changePosX) && (jy <= changePosY); jx++, jy++) {
            // 色を変える
            state[jy][jx] = targetColor;
        }
    }

    return true;
}

// 左上チェック
function checkLeftTop(xPos, yPos, targetColor) {
    return checkLeftTopWithTurn(xPos, yPos, targetColor, false);
}

// 左上反転
function leftTopChange(xPos, yPos, targetColor) {
    return checkLeftTopWithTurn(xPos, yPos, targetColor, true);
}

// 左上チェック＆反転
function checkLeftTopWithTurn(xPos, yPos, targetColor, isTurn) {

    let changePosX = 0;
    let changePosY = 0;

    // 端の場合は中止
    if (((xPos - 0) === 0) || ((yPos - 0) === 0)) {
        return false;
    }

    // 端より1個手前は中止
    if (((xPos - 0) === 1) || ((yPos - 0) === 1)) {
        return false;
    }

    // 隣に駒がない場合は中止
    if (state[((yPos - 0) - 1)][((xPos - 0) - 1)] === pNothing) {
        return false;
    }

    // 隣が同じ色の場合は中止
    if (state[((yPos - 0) - 1)][((xPos - 0) - 1)] === targetColor) {
        return false;
    }

    // 隣が違う色の時に続けて調べていく
    for (let lx = ((xPos - 0) - 1), ly = ((yPos - 0) - 1); (lx >= 0) && (ly >= 0); lx--, ly--) {
        if (state[ly][lx] === targetColor) {
            break;
        }
        if (state[ly][lx] === pNothing) {
            return false;
        }
        changePosX = lx;
        changePosY = ly;
    }

    // 端まで同じ色の場合中止
    if ((changePosX === 0) || (changePosY === 0)) {
        return false;
    }


    if (isTurn) {
        for (let jx = (xPos - 0), jy = (yPos - 0); (jx >= changePosX) && (jy >= changePosY); jx--, jy--) {
            // 色を変える
            state[jy][jx] = targetColor;
        }
    }

    return true;
}

// 左下チェック
function checkLeftBottom(xPos, yPos, targetColor) {
    return checkLeftBottomWithTurn(xPos, yPos, targetColor, false);
}

// 左下反転
function leftBottomChange(xPos, yPos, targetColor) {
    return checkLeftBottomWithTurn(xPos, yPos, targetColor, true);
}

// 左下チェック＆反転
function checkLeftBottomWithTurn(xPos, yPos, targetColor, isTurn) {

    let changePosX = 0;
    let changePosY = 0;

    // 端の場合は中止
    if (((xPos - 0) === 0) || ((yPos - 0) === (squareNum - 1))) {
        return false;
    }

    // 端より1個手前は中止
    if (((xPos - 0) === 1) || ((yPos - 0) === (squareNum - 2))) {
        return false;
    }

    // 隣に駒がない場合は中止
    if (state[((yPos - 0) + 1)][((xPos - 0) - 1)] === pNothing) {
        return false;
    }

    // 隣が同じ色の場合は中止
    if (state[((yPos - 0) + 1)][((xPos - 0) - 1)] === targetColor) {
        return false;
    }

    // 隣が違う色の時に続けて調べていく
    for (let lx = ((xPos - 0) - 1), ly = ((yPos - 0) + 1); (lx >= 0) && (ly < squareNum); lx--, ly++) {
        if (state[ly][lx] === targetColor) {
            break;
        }
        if (state[ly][lx] === pNothing) {
            return false;
        }
        changePosX = lx;
        changePosY = ly;
    }

    // 端まで同じ色の場合中止
    if ((changePosX === 0) || (changePosY === (squareNum - 1))) {
        return false;
    }

    if (isTurn) {
        for (let jx = (xPos - 0), jy = (yPos - 0); (jx >= changePosX) && (jy <= changePosY); jx--, jy++) {
            // 色を変える
            state[jy][jx] = targetColor;
        }
    }

    return true;
}
