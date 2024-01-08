function Gameboard() {
  let board = [[],[],[]];
  for (let i = 0; i < 3; i++){
    board[i].push(Cell());
    board[i].push(Cell());
    board[i].push(Cell())
  }
  
  function placeSign(player, row, column) {
    board[row][column].value = player
  }
  function printBoard()  {
    console.log(board.map(row => row.map(cell => cell.value)))
  }
  const getBoard = () => board
  
  function connectThree(player) {   
    // horizontal
    for (let i = 0; i < 3; i++) {
        if (board[i][0].value === player && board[i][1].value === player 
           && board[i][2].value === player) {return true}
    }
    // vertical 
    for (let i = 0; i < 3; i++) {
       if (board[0][i].value === player && board[1][i].value === player
        && board[2][i].value === player) {return true}
    }
    // diagonal
       if (board[0][0].value === player && board[1][1].value === player 
        && board[2][2].value === player || board[0][2].value === player 
        && board[1][1].value === player && board[2][0].value === player) {
         return true
       }
    return false
  }
  return { placeSign, getBoard, printBoard, connectThree }
}
function Cell() {
  let value = 0
  return { value }
}
function GameController() {
  let board = Gameboard()
  const players = [{
    name: "Player One",
    sign: "╳"
  },               {
    name: "Player Two",
    sign: "◯"                   
  }]
  let turns = 0;
  let activePlayer = players[0]
  function switchPlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }
  const getActivePlayer = () => activePlayer
  let winner;
  function checkWin(player) {
    winner = board.connectThree(player) 
    if (turns == 9 && winner == false) winner = "tie"
  }
  const getWinner = () => winner
  function playTurn(row, column)  {
    board.placeSign(activePlayer.sign, row, column)
    turns++
    checkWin(activePlayer.sign)
    board.printBoard()
    switchPlayer()
  }
  function reset() {
    ScreenController()
  }
  return { playTurn, getBoard: board.getBoard, getActivePlayer, getWinner}
}
function ScreenController() {
  const game = GameController()
  const board = game.getBoard()
  const dialog = document.querySelector('dialog')
  const h1 = document.querySelector('h1')
  // clean the board then add board squares
  dialog.close()
  document.querySelector(".gameboard").textContent = ""
  
  board.forEach((row, i) => {
    row.forEach((column, j) => {
         const button = document.createElement("button");
         button.classList.add("cell");
         button.dataset.row = i;
         button.dataset.column = j;
         document.querySelector(".gameboard").appendChild(button)
         button.addEventListener('click', clickHandlerCell)
       })
  })
  function displayWinner(player) {
    if (game.getWinner()) {
      dialog.showModal()
      h1.textContent = `${player.name} has won!`
    }                      
    if (game.getWinner() === "tie") {
      h1.textContent = `It's a tie!`
    }
  }
  function updateScreen(player, cell) {
    cell.textContent = player.sign
    game.playTurn(cell.dataset.row, cell.dataset.column)
    displayWinner(player)
  }
  // click handler
  function clickHandlerCell(e) {
    const cell = e.target
    const player = game.getActivePlayer()
    updateScreen(player, cell)
    cell.removeEventListener('click', clickHandlerCell)  
  }  
}
ScreenController()
