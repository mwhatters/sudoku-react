class Coordinates {
  constructor(row, col, incrementOnInit) {
    this.row = row
    this.col = col
    this.incrementOnInit = incrementOnInit

    if (incrementOnInit) {
      this.increment()
    }
  }

  increment() {
    this.col++
    if (this.col === 9) {
      this.col = 0
      this.row++
    }
  }

  toArray() {
    return [this.row, this.col]
  }
}

export default Coordinates