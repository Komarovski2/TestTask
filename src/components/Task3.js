import React, { useState, useEffect } from 'react';

function Task3() {
  const M = 5;
  const N = 5; 

  const [grid, setGrid] = useState(
    Array(M)
      .fill()
      .map(() => Array(N).fill(1))
  );
  const [components, setComponents] = useState(1);

  const countComponents = (currentGrid) => {
    let visited = Array(M)
      .fill()
      .map(() => Array(N).fill(false));
    let componentCount = 0;

    const dfs = (i, j) => {
      if (i < 0 || i >= M || j < 0 || j >= N || visited[i][j] || currentGrid[i][j] === 0) {
        return;
      }
      visited[i][j] = true;
      dfs(i + 1, j); 
      dfs(i - 1, j); 
      dfs(i, j + 1); 
      dfs(i, j - 1);
    };

    for (let i = 0; i < M; i++) {
      for (let j = 0; j < N; j++) {
        if (currentGrid[i][j] === 1 && !visited[i][j]) {
          dfs(i, j);
          componentCount++;
        }
      }
    }

    return componentCount;
  };

  useEffect(() => {
    const result = countComponents(grid);
    setComponents(result);
  }, [grid]);

  const handleCellClick = (i, j) => {
    if (grid[i][j] === 0) return; 
    const newGrid = grid.map((row) => [...row]); 
    newGrid[i][j] = 0; 
    setGrid(newGrid);
  };

  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < M; i++) {
      for (let j = 0; j < N; j++) {
        cells.push(
          <div
            key={`${i}-${j}`}
            className={`cell ${grid[i][j] === 0 ? 'cut' : ''}`}
            onClick={() => handleCellClick(i, j)}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="task task-leaf">
      <h2>Розпад листка</h2>
      <p>
        Кількість частин: <span>{components}</span>
      </p>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${N}, 30px)` }}>
        {renderGrid()}
      </div>
    </div>
  );
}

export default Task3;