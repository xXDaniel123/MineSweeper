'use strict'

var MINE = '💣';
var FLAG = '⛳';
var GAME_ON = '😀';
var GAME_OVER = '🤯';
var GAME_WON = '😎';

var gBoard = [];

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gTotalMines = 0;
var gStatus = document.querySelector('.emoji');

// ----------------------------------------------------------------

function init() {
    gBoard = buildBoard(gLevel.SIZE);
    gStatus.innerHTML = GAME_ON
    insertRandomMines(gBoard)
    renderBoard(gBoard)

    gTotalMines = 0;
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;

    document.querySelector('.subHeader').innerText = 'Start when your\'e ready'
    document.querySelector('.timer').innerText = '00 : 00'

}

function renderBoard(board) {
    var strHTML = ``;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`

        for (var j = 0; j < board[i].length; j++) {
            strHTML += `<td class="cell cell-${i}-${j}" 
            onclick="cellClicked(this,${i},${j})" 
            oncontextmenu="cellMarked(this,${i},${j})">`

            if (board[i][j].isMine) strHTML += `${MINE}`
            if (!board[i][j].isMine) { // check for mines around cells which are not mines

                var neighborsSum = setMinesNegsCount(board, i, j) // count neighboring mines

                board[i][j].minesAroundCount = neighborsSum
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
        }
    }
    return board
}

function insertRandomMines(board) {
    while (gTotalMines < gLevel.MINES) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                var currRandomCell = randomMines()
                if (currRandomCell) {
                    board[i][j].isMine = true;
                }
            }
        }
    }
}

function randomMines() {
    var currRatio = getMinesRatio(gLevel.SIZE, gLevel.MINES) * 100; // receive 13 
    var currRandom = getRandomInteger(0, 100);
    if (currRatio > currRandom && gTotalMines < gLevel.MINES) {
        gTotalMines++
        return true
    }
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

function getMinesRatio(size, mines) {
    var ratio = (mines / (size * size)).toFixed(2)
    return ratio
}

function cellClicked(elCell, i, j) {

    if (!gGame.isOn) return;

    if (gBoard[i][j].isMine) {
        if (gBoard[i][j].isMarked) {
            elCell.innerHTML = MINE
        }
        elCell.classList.add('show') // need to show all mines and end game
        gameOver(gBoard);
    }

    if (!gBoard[i][j].isMine) {
        // update the modal
        gBoard[i][j].isShowen = true;
        // show results on screen
        elCell.classList.add('show')
        elCell.innerHTML = gBoard[i][j].minesAroundCount;

        if (gBoard[i][j].minesAroundCount === 0) {
            showCellsAround(gBoard, i, j)
        };
        gGame.shownCount++
    }
    checkGameWon(gBoard)
}

function showCellsAround(board, i, j) {

    var cellI = i;
    var cellJ = j;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;

            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)

            if (board[i][j].isMarked) continue;
            elCurrCell.classList.add('show')
            board[i][j].isShowen = true
            elCurrCell.innerHTML = board[i][j].minesAroundCount;
        }
    }
}

function cellMarked(elCell, i, j) {

    if (!gGame.isOn) return;

    if (gBoard[i][j].isShowen) return;

    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;

        elCell.innerHTML = FLAG;
        elCell.classList.add('show');
        checkGameWon(gBoard);
        return;
    }

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;

        if (gBoard[i][j].isMine) {
            elCell.innerHTML = MINE;
            checkGameWon(gBoard);
        };
        if (!gBoard[i][j].isMine) elCell.innerHTML = '';
        elCell.classList.remove('show');
        return;
    }
}


function gameOver(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            if (cell.isMine) {
                cell.isShowen = true;
            }
        }
    }
    gGame.isOn = false
    gStatus.innerHTML = GAME_OVER
    document.querySelector('.subHeader').innerText = 'maybe next time.. want to try again?'
}

function checkGameWon(board) {
    var minesMarkedCount = 0;
    var numIsShown = 0;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];

            if (currCell.isMine && currCell.isMarked) {
                minesMarkedCount++
            }
            if (!currCell.isMine && currCell.isShowen) {
                numIsShown++
            }
        }
    }

    if (minesMarkedCount === gLevel.MINES &&
        (gLevel.SIZE * gLevel.SIZE - gLevel.MINES) === numIsShown) {
        gGame.isOn = false;
        gStatus.innerHTML = GAME_WON;
        document.querySelector('.subHeader').innerText = 'WON!'
    };
}


function changeDifficulty(el) {

    if (+el.dataset.difficulty === 3) {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
    }

    if (+el.dataset.difficulty === 2) {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
    }

    if (+el.dataset.difficulty === 1) {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
    }
    gGame.isOn = false;
    init();
}

function timeFormat(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var seconds = time.getSeconds();
    var milliseconds = time.getMilliseconds();
    return seconds + " : " + milliseconds;
}

// had a problem with the timer and not time to fix it @_@
function timer() {
    el.removeEventListener('click', timer)
    var startTime = Date.now()
    var timer = setInterval(function () {
        document.querySelector('.timer').innerText = timeFormat(Date.now() - startTime);
        if (!gGame.isOn) {
            clearInterval(timer);
        }
    }, 100);
}