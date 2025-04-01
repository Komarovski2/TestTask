import React, { useState } from 'react';

function Task1() {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  function countLuckyTickets(N) {
    let start = 0;
    let end = Math.pow(10, 2 * N) - 1;
    let count = 0;

    for (let num = start; num <= end; num++) {
      let numStr = num.toString().padStart(2 * N, '0');
      let firstHalf = numStr.slice(0, N);
      let secondHalf = numStr.slice(N);

      let sumFirst = 0;
      for (let i = 0; i < firstHalf.length; i++) {
        sumFirst += Number(firstHalf[i]);
      }

      let sumSecond = 0;
      for (let i = 0; i < secondHalf.length; i++) {
        sumSecond += Number(secondHalf[i]);
      }

      if (sumFirst === sumSecond) {
        count++;
      }
    }

    return count;
  }

  const handleCalculate = () => {
    const n = parseInt(inputValue, 10);
    if (!isNaN(n) && n >= 1) {
      const luckyTickets = countLuckyTickets(n);
      setResult(`Кількість щасливих квитків: ${luckyTickets}`);
    } else {
      setResult('Введіть коректне число >= 1');
    }
  };

  return (
    <div className="task">
      <h2>Task 1</h2>
      <input
        type="number"
        min="1"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleCalculate}>Розрахувати</button>
      <div>{result}</div>
    </div>
  );
}

export default Task1;