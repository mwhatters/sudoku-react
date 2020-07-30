import Coordinates from './coordinates'
import Validator from './validator'

class Game {
  constructor(board, live) {
    this.board = this.generateUnfrozenBoard(board);
    this.givenNumberCoordinates = this.collectGivenNumberCoordinates()
    this.numberOfMoves = 0
    this.states = []
    this.live = live;
    this.invalidBoard = false
    this.solving = false;
  }

  solve(row = 0, col = 0) {
    this.solving = true;
    if (this.numberOfMoves > 200_000) {
      this.invalidBoard = true;
      return false
    }

    if (this.numberOfMoves === 0 && !new Validator(this.board).valid()) {
      this.invalidBoard = true;
      return false
    }

    let currentRow = row
    let currentCol = col
    let nextStep = new Coordinates(row, col, true)

    while (this.givenNumberCoordinates.find(el => {
      return JSON.stringify(el) === JSON.stringify(nextStep.toArray())
    })) {
      nextStep.increment()
    }

    this.numberOfMoves++
    let sudokuNumber = 1
    while (sudokuNumber < 10) {
      this.board[currentRow][currentCol] = sudokuNumber;
      let validator = new Validator(this.board)
      if (validator.valid()) {
        if (this.live) {
          this.states.push(this.generateUnfrozenBoard(this.board))
        }
        if (validator.complete()) {
          this.solving = false;
          return true 
        }
        if (this.solve(nextStep.row, nextStep.col)) { return true }
      }
      sudokuNumber++
    }

    this.board[currentRow][currentCol] = ''
    return false
  }

  collectGivenNumberCoordinates() {
    let coordinates = []
    this.board.forEach((row, i) => {
      row.forEach((col, k) => {
        if (!this.isEmpty(col)) {
          coordinates.push([i, k])
        }
      })
    })
    return coordinates
  }

  generateUnfrozenBoard(board) {
    let newBoard = []
    board.forEach((row, i) => {
      newBoard[i] = []
      row.forEach((col, k) => {
        newBoard[i][k] = col
      })
    })
    return newBoard
  }

  isEmpty(value) {
    return value === 0 || value === undefined || value === ''
  }
}

export default Game