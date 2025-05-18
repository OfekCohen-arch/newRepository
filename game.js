'use strict'
var gBoard = []
var gLevel = {
 SIZE: 4,
 MINES: 2
}
var gGame = {
 isOn: true,
 revealedCount: 0,
 markedCount: 0,
 secsPassed: 0
}
var gMines =[]
const MINE = `<img src="img/mine.png"/>`
const FLAG = `<img src="img/flag.png"/>`
const ONE = `<img src ="img/one.png"/>`
const TWO = `<img src ="img/two.png"/>`
const THREE = `<img src ="img/three.png"/>`
const FOUR = `<img src ="img/four.png"/>`
const FIVE = `<img src ="img/five.png"/>`
const SIX = `<img src ="img/six.png"/>`
const SEVEN = `<img src ="img/seven.png"/>`
const EIGHT = `<img src ="img/eight.png"/>`

var elContainer = document.querySelector('.board-container')
elContainer.addEventListener("contextmenu", (e) => {e.preventDefault()});


function onInit(){
gBoard = buildBoard()
console.log(gBoard)
setMinesNegsCount(gBoard)
renderBoard(gBoard)
}
function buildBoard(){
const size = gLevel.SIZE
var board = []
for(var i = 0;i<size;i++){
    board.push([])
    for(var j = 0;j<size;j++){
        var cell = {
 minesAroundCount: 4,
 isRevealed: false,
 isMine: false,
 isMarked: false,
 i: i,
 j : j
}
board[i].push(cell)
    }
}
var mineCount = 0
while(mineCount<gLevel.MINES){
var mineI = getRandomInt(0,size-1)
var mineJ = getRandomInt(0,size-1)
console.log('mineI: '+mineI)
console.log('mineJ: '+mineJ)
if(!board[mineI][mineJ].isMine){
    board[mineI][mineJ].isMine = true
   gMines.push(board[mineI][mineJ]) 
    mineCount++
} 
}
    return board
}
function setMinesNegsCount(board){
for(var i = 0;i<board.length;i++){
    for(var j = 0;j<board[0].length;j++){
        board[i][j].minesAroundCount = negsCounter(board[i][j])
    }
}
}
function negsCounter(cell){
    var count = 0
for(var i = cell.i-1;i<=cell.i+1;i++){
    for(var j = cell.j-1;j<=cell.j+1;j++){
        if(i === -1 || j === -1  || i === gBoard.length || j === gBoard.length) continue
        if(i === cell.i && j === cell.j) continue
        if(gBoard[i][j].isMine) count++
    }
}
return count
}
function renderBoard(board){
var strHtml = ''
strHtml+=`<table><tbody>`
for(var i = 0;i<board.length;i++){
strHtml+=`<tr>`
for(var j = 0;j<board[0].length;j++){
    const cell = board[i][j]
    const cellContext = getCellContext(cell)
            const className = `cell cell-${i}-${j}`
            strHtml += `<td class="${className}" oncontextmenu="onCellMarked(this,${i},${j})" onClick="onCellClicked(this,${i},${j})">${cellContext}</td>`
}
strHtml+=`</tr>`
}
strHtml+=`</tbody></table>`
elContainer.innerHTML = strHtml
}
function onCellClicked(elCell,i,j){
if(!gGame.isOn) return
if(gBoard[i][j].isMarked) return
gBoard[i][j].isRevealed = true
renderCell(elCell,i,j)
expandReveal(gBoard,i,j)
}
function onCellMarked(elCell, i, j){
    if(!gGame.isOn) return
    if(gBoard[i][j].isRevealed) return
gBoard[i][j].isMarked = !gBoard[i][j].isMarked
renderCell(elCell,i,j)
}
function checkGameOver(){

}
function expandReveal(board,i, j){
if(board[i][j].isMine || board[i][j].minesAroundCount>0) return 
const cell = board[i][j]
for(var i = cell.i-1;i<=cell.i+1;i++){
    for(var j = cell.j-1;j<=cell.j+1;j++){
        if(i === -1 || j === -1  || i === gBoard.length || j === gBoard.length) continue
        if(gBoard[i][j].isRevealed) continue
        const className = `.cell.cell-${i}-${j}`
        const currCell = document.querySelector(className)
        gBoard[i][j].isRevealed = true
        renderCell(currCell,i,j)
        expandReveal(board,i,j)
    }
}
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function getCellContext(cell){
    if(cell.isMarked) return FLAG
    if(cell.isRevealed){
     if(cell.isMine) return MINE
     switch(cell.minesAroundCount){
        case 1: return ONE 
        case 2: return TWO
        case 3: return THREE
        case 4: return FOUR
        case 5: return FIVE
        case 6: return SIX
        case 7: return SEVEN
        case 8: return EIGHT
        default: return ''
     }
    }
    else return ''
}
function renderCell(elCell,i,j) {
    elCell.innerHTML = getCellContext(gBoard[i][j])
   // console.log(elCell)
     if(gBoard[i][j].isMine && gGame.isOn) {
     gGame.isOn = false
     elCell.style.backgroundColor = 'red'
     renderMines()
     }
     else if(elCell.style.backgroundColor!='red'){
        elCell.style.backgroundColor = 'gray'
     } 
}
function renderMines(){
for(var i = 0;i<gBoard.length;i++){
    for(var j = 0;j<gBoard.length;j++){
        if(gBoard[i][j].isMine){
            gBoard[i][j].isRevealed = true
            const className = `.cell.cell-${i}-${j}`
            const elCell = document.querySelector(className)
           // console.log('i: '+i+' j: '+j)
            renderCell(elCell,i,j)
        } 
    }
}
}

