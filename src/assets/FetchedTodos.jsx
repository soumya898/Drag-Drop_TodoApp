import React, { useState, useEffect } from 'react';


const FetchedTodos = () => {
  const [apiTodos, setApiTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
      .then(response => response.json())
      .then(data => setApiTodos(data))
      .catch(() => setError('Failed to load API data'));
  }, []);

  return (
    <div className="todo-container">
      <h2 className="header">Fetched Todos</h2>

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
        </div>
      )}

      <button onClick={() => setShowCompleted(!showCompleted)} className="toggle-btn">
        {showCompleted ? 'Hide Completed' : 'Show Completed'}
      </button>

      <ul className="task-list">
        {apiTodos
          .filter(todo => (showCompleted ? true : !todo.completed))
          .map(todo => (
            <li key={todo.id} className={`task-item ${todo.completed ? 'completed' : ''}`}>
              <span>{todo.title}</span> <small>(User {todo.userId})</small>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FetchedTodos;