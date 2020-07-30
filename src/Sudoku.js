import React, { useState } from 'react';
import produce from "immer"
import './Sudoku.css';
import Game from './lib/sudoku/game'

const generateNewBoard = () => {
  const rows = []
  for (let i = 0; i < 9; i++) {
    rows.push(Array.from(Array(9), () => ''))
  }
  return rows;
}

const Sudoku = () => {
  const [solving, setSolving] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [numMoves, setNumMoves] = useState(0)
  const [board, setBoard] = useState(() => generateNewBoard())

  const solveBoard = (live) => {
    setSolving(true)

    let game = new Game(board, live)
    game.solve()
    if (game.invalidBoard) {
      setInvalid(true)
      return;
    }

    if (live) {
      replayGame(game)
    } else {
      setBoard(game.board)
      setNumMoves(game.numberOfMoves)
    }
  }

  const resetBoard = () => {
    setBoard(generateNewBoard())
    setInvalid(false)
    setSolving(false)
    setNumMoves(0)
  }

  const replayGame = (game) => {
    let i = 0;
    let interval = setInterval(function () {
      let move = game.states[i];
      setBoard(move)
      setNumMoves(i)
      i++;
      if (i === game.states.length) {
        clearInterval(interval)
        game.states = []
      }
    }, 1);
  }

  return (
    <div className="Sudoku-grid-wrapper">
      <div className="Sudoku-grid">
        {board.map((rows, i) => 
          rows.map((col, k) => 
          <div 
            key={`${i}-${k}`}
            className="Sudoku-square"
          >
            <input
              value={col}
              type="number"
              min="0"
              max="9"
              className="Sudoku-input"
              style={{ color: col === 0 ? 'white' : 'black' }}
              disabled={solving}
              onChange={(e) => {
                if (e.target.value > 9) { e.target.value = 9 }
                if (e.target.value < 0) { e.target.value = 1 }
                const newBoard = produce(board, boardCopy => {
                  boardCopy[i][k] = parseInt(e.target.value)
                })
                setBoard(newBoard)
              }}
              onClick={(e) => {
                if (parseInt(e.target.value) === 0) {
                  e.target.value = undefined
                }
              }}
            />
          </div>
          )
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', padding: 20, width: '100px' }}>
        <button onClick={() => solveBoard()}>Solve</button>
        <div style={{ height: 20 }}/>
        <button onClick={() => solveBoard(true)}>Solve Live</button>
        <div style={{ height: 20 }}/>
        <button onClick={() => resetBoard()}>Reset</button>
        <div style={{ height: 20 }}/>
        {invalid ? "Invalid Board" : ""}
        {numMoves ? `Moves: ${numMoves}` : ''}
      </div>
    </div>
  )
}

export default Sudoku