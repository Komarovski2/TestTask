import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Мої задачі</h1>
      <div className="task-buttons">
        <button>
          <Link to="/task1" style={{ color: 'white', textDecoration: 'none' }}>
            Task 1
          </Link>
        </button>
        <button>
          <Link to="/task2" style={{ color: 'white', textDecoration: 'none' }}>
            Task 2
          </Link>
        </button>
        <button>
          <Link to="/task3" style={{ color: 'white', textDecoration: 'none' }}>
            Task 3
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Home;