'use strict'

var MINE = '💣'

var gBoard = [];

var gLevel = {
    SIZE: 4,
    MIMNES: 2
}

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard = buildBoard(gLevel.SIZE);

renderBoard(gBoard)
// ----------------------------------------------------------------

function init() {
    console.log('game start');

}


function renderBoard(board) {

    var strHTML = ``;

    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`

        for (var j = 0; j < board[i].length; j++) {

            var checkIsMine = board[i][j].isMine

            strHTML += `<td class="cell ${i}-${j}" 
            onclick="cellClicked(this,${i},${j})" 
            oncontextmenu="cellMarked(this)">`
            if (checkIsMine) strHTML += `${MINE}`
        }
        strHTML += `</tr>`
    }
    var elTable = document.querySelector('.container');
    elTable.innerHTML = strHTML
}

function buildBoard(difficulty) {

    var mat = [];
    for (var i = 0; i < difficulty; i++) {
        mat[i] = [];
        for (var j = 0; j < difficulty; j++) {

            var cell = {
                minesAroundCount: null,
                isShowen: true,
                isMine: false,
                isMarked: false
            }
            mat[i][j] = cell

            // setting bombs
            if (i === 2 && j === 2) {
                var currCell = mat[i][j];
                currCell = cell.isMine = true

            }
            if (i === 3 && j === 1) {
                var currCell = mat[i][j];
                currCell = cell.isMine = true
            }
        }
    }
    return mat
}

function cellClicked(ev, i, j) {
    console.log('check click');
    console.dir(ev);
    console.log(i, j);

}

function setMinesNegsCount(board) {

    var neighborsSum = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j] === LIFE || board[i][j] === SUPER_LIFE) neighborsSum++;
        }
        return neighborsSum;

    }

}

console.table(gBoard);