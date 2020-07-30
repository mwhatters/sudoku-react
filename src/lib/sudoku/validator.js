class Validator {
  constructor(board) {
    this.board = board; // 2d array
  }

  valid() {
    return this.validRows() && this.validColumns() && this.validSquares()
  }

  complete() {
    let complete = true;
    this.board.forEach(row => {
      const presentValues = row.filter((el) => !this.isEmpty(el))
      if (presentValues.length !== row.length) {
        complete = false
        return false;
      }
    })
    return this.valid() && complete
  }

  validRows() {
    let valid = true
    this.board.forEach(row => {
      if (this.dupesFound(row)) {
        valid = false
        return false
      }
    })
    return valid
  }

  validColumns() {
    let valid = true
    const columns = this.board[0].map((_, colIndex) => this.board.map(row => row[colIndex]));
    columns.forEach(column => {
      if (this.dupesFound(column)) {
        valid = false
        return false
      }
    })
    return valid
  }

  validSquares() {
    let valid = true
    this.squareSegments.forEach(segment => {
      const square = []
      const x = segment[0]
      const y = segment[1]

      this.operators.forEach(operation => {
        const i = operation[0]
        const k = operation[1]
        square.push(this.board[x+i][y+k])
      })
    
      if (this.dupesFound(square)) {
        valid = false
        return false
      }
    })

    return valid
  }

  dupesFound(array) {
    const presentValues = array.filter((el) => !this.isEmpty(el))
    var unique = presentValues.filter(this.onlyUnique);
    return unique.length !== presentValues.length
  }

  isEmpty(value) {
    return value === 0 || value === undefined || value === ''
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  squareSegments = [
    // x, y
    [1, 1],
    [1, 4],
    [1, 7],
    [4, 1],
    [7, 1],
    [4, 4],
    [4, 7],
    [7, 4],
    [7, 7] 
  ]

  operators = [
    //x, y
    [0, 0],
    [0, 1],
    [0, -1],
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, 0],
    [1, 0],
  ]

}

export default Validator