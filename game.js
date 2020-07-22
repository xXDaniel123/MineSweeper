'use strict'

var MINE = '💣'
var FLAG = '⛳'

var gBoard = [];

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// ----------------------------------------------------------------

function init() {
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard)
}


function renderBoard(board) {

    var strHTML = ``;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`

        for (var j = 0; j < board[i].length; j++) {
            strHTML += `<td class="cell cell-${i}-${j}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this)">`

            if (board[i][j].isMine) strHTML += `${MINE}`
            if (!board[i][j].isMine) { // check for mines around cells which are not mines

                var neighborsSum = setMinesNegsCount(board, i, j)
                strHTML += `${neighborsSum}`
            }
        }
        strHTML += `</tr>`
    }
    var elTable = document.querySelector('.container');
    elTable.innerHTML = strHTML
}

function buildBoard(difficulty) {

    var board = [];
    for (var i = 0; i < difficulty; i++) {
        board[i] = [];
        for (var j = 0; j < difficulty; j++) {

            var cell = {
                minesAroundCount: null,
                isShowen: false,
                isMine: false,
                isMarked: false
            }

            board[i][j] = cell

            // setting bombs - will set up random cells with bombs
            if (i === 2 && j === 2) board[i][j].isMine = true
            if (i === 3 && j === 1) board[i][j].isMine = true
        }
    }
    return board
}

function setMinesNegsCount(board, cellI, cellJ) {

    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) neighborsSum++;
        }
    }
    return neighborsSum;
}


function cellClicked(ev, i, j) {
    console.dir(ev);
    console.log(i, j);

    ev.classList.add('show')
    gBoard[i][j].isShowen = true;

    if (ev.innerHTML === '0') console.log('here will be show around');

    // renderBoard(gBoard)

}

function cellMarked(elCell) {
    console.log(elCell);
    console.dir(elCell);
    console.dir('its working');
}