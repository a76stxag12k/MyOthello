// 盤面描画
async function drawBorad() {

    // 先に置いたコマを描画する
    let i = 0;
    for (let rows of state) {
        if (i >= squareNum) {
            break;
        }
        let j = 0;
        for (let el of rows) {
            if (j >= squareNum) {
                break;
            }
            if (el !== pNothing) {
                let rawSquare = document.getElementById('row-' + i + '-' + j);
                let piece = document.getElementById('pic-' + rawSquare.id.substring(4));
                if (el === pWhite) {
                    await turnPieceAnimation(piece, 180);
                } else if (el === pBlack) {
                    await turnPieceAnimation(piece, 0);
                }
            }
            j++;
        }
        i++;
    }

    i = 0;
    for (let rows of state) {
        if (i >= squareNum) {
            break;
        }
        let j = 0;
        for (let el of rows) {
            if (j >= squareNum) {
                break;
            }
            if (el !== pNothing) {
                let rawSquare = document.getElementById('row-' + i + '-' + j);
                let piece = document.getElementById('pic-' + rawSquare.id.substring(4));
                if (el === pWhite) {
                    if (piece.style.display !== 'none') {
                        await turnPieceAnimation(piece, 180);
                    }
                } else if (el === pBlack) {
                    if (piece.style.display !== 'none') {
                        await turnPieceAnimation(piece, 0);
                    }
                }
            }
            j++;
        }
        i++;
    }
    countPiace();
}

async function turnPieceAnimation(p, r) {
    let backTransform = p.style.transform;
    p.style.transform = '';
    p.style.display = 'block';
    p.style.transform = 'rotateY(' + r + 'deg)';
    p.style.transformOrigin = '24px 24px';
    if (backTransform === p.style.transform) {
        return;
    }
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve();
    //         // reject();
    //     }, 1000);
    // });

    const promise = new Promise((resolve, reject) => {
        p.addEventListener('transitionend', () => resolve(), {
            "once": true
        });
    });
}
