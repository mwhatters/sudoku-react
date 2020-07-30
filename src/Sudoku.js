import React, { useState } from 'react';
import produce from "immer"
import logo from './logo.svg';
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
  const [board, setBoard] = useState(() => generateNewBoard())
  const [solving, setSolving] = useState(false)
  const [live, setLive] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [numMoves, setNumMoves] = useState(0)

  const solveBoard = async (liveReplay) => {
    setSolving(true)
    setLive(liveReplay)

    let game = new Game(board, liveReplay)
    game.solve()
    if (game.invalidBoard) {
      setInvalid(true)
      return;
    }

    if (liveReplay) {
      await replayGame(game)
      setSolving(false)
      setLive(false)
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

  const replayGame = async (game) => {
    let i = 0;
    return await new Promise(resolve => {
      const interval = setInterval(() => {
        let move = game.states[i];
        setBoard(move)
        setNumMoves(i)
        i++;
        if (i === game.states.length) {
          resolve(game.states = [])
          clearInterval(interval)
        }
      }, 1);
    });
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
        <button onClick={() => solveBoard(true)}>Solve (Live Replay)</button>
        <div style={{ height: 20 }}/>
        <button onClick={() => resetBoard()}>Reset</button>
        <div style={{ height: 20 }}/>
        {solving && live 
          ? <img src={logo} className="App-logo o__small" alt="logo" />
          : ""
        }
        {invalid ? "Invalid Board" : ""}<br/>
        {numMoves ? `Moves: ${numMoves}` : ''}<br/>
      </div>
    </div>
  )
}

export default Sudoku