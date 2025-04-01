import React, { useEffect } from 'react';

const SIZE = 10;
const MINE_COUNT = 10;

const Task2 = () => {
  let grid = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  let cellState = Array(SIZE).fill().map(() => Array(SIZE).fill("closed"));
  let gameOver = false;
  let firstClick = true;
  let timerInterval = null;
  let timeLeft = 0;

  useEffect(() => {
    createGrid();
    return () => {
      stopTimer();
    };
  }, []);

  const createGrid = () => {
    const gridElement = document.getElementById("grid");
    gridElement.style.gridTemplateColumns = `repeat(${SIZE}, 30px)`;

    gridElement.innerHTML = "";
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener("click", () => openCell(i, j));
        cell.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          toggleFlag(i, j, cell);
        });
        gridElement.appendChild(cell);
      }
    }
  };

  const placeMines = (excludeRow, excludeCol) => {
    let placed = 0;
    while (placed < MINE_COUNT) {
      let i = Math.floor(Math.random() * SIZE);
      let j = Math.floor(Math.random() * SIZE);
      if (grid[i][j] !== -1 && !(Math.abs(i - excludeRow) <= 1 && Math.abs(j - excludeCol) <= 1)) {
        grid[i][j] = -1;
        placed++;
      }
    }

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === -1) continue;
        grid[i][j] = countMinesAround(i, j);
      }
    }
  };

  const countMinesAround = (row, col) => {
    let count = 0;
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        if (di === 0 && dj === 0) continue;
        let ni = row + di;
        let nj = col + dj;
        if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE && grid[ni][nj] === -1) {
          count++;
        }
      }
    }
    return count;
  };

  const openCell = (row, col) => {
    if (gameOver || cellState[row][col] === "flag") return;

    if (firstClick) {
      placeMines(row, col);
      firstClick = false;
      startTimer();
    }

    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellState[row][col] = "open";
    cell.classList.add("open");

    if (grid[row][col] === -1) {
      cell.classList.add("mine");
      gameOver = true;
      stopTimer();
      document.getElementById("message").innerText = "Game Over! You hit a mine.";
      revealMines();
      return;
    }

    if (grid[row][col] > 0) {
      cell.innerText = grid[row][col];
    } else if (grid[row][col] === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          let ni = row + di;
          let nj = col + dj;
          if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE && cellState[ni][nj] === "closed") {
            openCell(ni, nj);
          }
        }
      }
    }

    checkWin();
  };

  const toggleFlag = (row, col, cell) => {
    if (gameOver || cellState[row][col] === "open") return;
    if (cellState[row][col] === "flag") {
      cellState[row][col] = "closed";
      cell.classList.remove("flag");
      cell.innerText = "";
    } else {
      cellState[row][col] = "flag";
      cell.classList.add("flag");
      cell.innerText = "🚩";
    }
  };

  const revealMines = () => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === -1) {
          const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
          cell.classList.add("mine");
          cell.innerText = "💣";
        }
      }
    }
  };

  const checkWin = () => {
    let closedCells = 0;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (cellState[i][j] === "closed" || cellState[i][j] === "flag") {
          closedCells++;
        }
      }
    }
    if (closedCells === MINE_COUNT) {
      gameOver = true;
      stopTimer();
      document.getElementById("message").innerText = "You Win! All mines found.";
    }
  };

  const solveStep = () => {
    if (gameOver) return;

    let madeMove = false;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (cellState[i][j] !== "open" || grid[i][j] === 0) continue;

        let flagCount = 0;
        let closedCount = 0;
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;
            let ni = i + di;
            let nj = j + dj;
            if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE) {
              if (cellState[ni][nj] === "flag") flagCount++;
              if (cellState[ni][nj] === "closed") closedCount++;
            }
          }
        }

        if (grid[i][j] === flagCount && closedCount > 0) {
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (di === 0 && dj === 0) continue;
              let ni = i + di;
              let nj = j + dj;
              if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE && cellState[ni][nj] === "closed") {
                openCell(ni, nj);
                madeMove = true;
              }
            }
          }
        }
      }
    }

    if (!madeMove) {
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (cellState[i][j] !== "open" || grid[i][j] === 0) continue;

          let flagCount = 0;
          let closedCount = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (di === 0 && dj === 0) continue;
              let ni = i + di;
              let nj = j + dj;
              if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE) {
                if (cellState[ni][nj] === "flag") flagCount++;
                if (cellState[ni][nj] === "closed") closedCount++;
              }
            }
          }

          if (grid[i][j] - flagCount === closedCount && closedCount > 0) {
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                if (di === 0 && dj === 0) continue;
                let ni = i + di;
                let nj = j + dj;
                if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE && cellState[ni][nj] === "closed") {
                  const cell = document.querySelector(`[data-row="${ni}"][data-col="${nj}"]`);
                  toggleFlag(ni, nj, cell);
                  madeMove = true;
                }
              }
            }
          }
        }
      }
    }

    if (!madeMove && !gameOver) {
      let closedCells = [];
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (cellState[i][j] === "closed") {
            closedCells.push({ row: i, col: j });
          }
        }
      }
      if (closedCells.length > 0) {
        const randomCell = closedCells[Math.floor(Math.random() * closedCells.length)];
        openCell(randomCell.row, randomCell.col);
      }
    }
  };

  const startTimer = () => {
    if (timerInterval) return;

    const minutes = parseInt(document.getElementById("timerSelect").value);
    timeLeft = minutes * 60;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        stopTimer();
        gameOver = true;
        document.getElementById("message").innerText = "Game Over! Time is up.";
        revealMines();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const updateTimerDisplay = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetGame = () => {
    stopTimer();
    grid = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
    cellState = Array(SIZE).fill().map(() => Array(SIZE).fill("closed"));
    gameOver = false;
    firstClick = true;
    timeLeft = 0;
    document.getElementById("timer").innerText = "00:00";
    document.getElementById("message").innerText = "";
    const gridElement = document.getElementById("grid");
    gridElement.innerHTML = "";
    createGrid();
  };

  return (
    <div className="task task-minesweeper">
      <h2>Minesweeper</h2>
      <div>
        <label htmlFor="timerSelect">Виберіть час (хвилини): </label>
        <select id="timerSelect">
          <option value="1">1 хвилина</option>
          <option value="3">3 хвилини</option>
          <option value="5">5 хвилин</option>
        </select>
      </div>
      <p>Час: <span id="timer">00:00</span></p>
      <button onClick={solveStep}>Розв’язати (крок)</button>
      <button onClick={resetGame}>Зіграти ще раз</button>
      <div id="grid" className="grid"></div>
      <p id="message" className="message"></p>
    </div>
  );
};

export default Task2;