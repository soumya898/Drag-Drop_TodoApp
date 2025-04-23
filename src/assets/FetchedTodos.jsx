import React, { useState, useEffect } from 'react';

/**
 * FetchedTodos is a React functional component that fetches a list of todos
 * from an external API (JSONPlaceholder). It allows toggling the visibility 
 * of completed todos and displays basic error handling if the fetch fails.
 */
const FetchedTodos = () => {
  // State to store the todos fetched from the API
  const [apiTodos, setApiTodos] = useState([]);

  // State to determine whether completed todos should be shown
  const [showCompleted, setShowCompleted] = useState(true);

  // State to store any error message that occurs during the fetch request
  const [error, setError] = useState(null);

  /**
   * useEffect runs only once on component mount (empty dependency array [])
   * It fetches data from a placeholder API limited to 10 todo items.
   * On success: the todos are stored in the `apiTodos` state.
   * On failure: an error message is shown to the user.
   */
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
      .then(response => response.json())
      .then(data => setApiTodos(data)) // Successfully fetched data
      .catch(() => setError('Failed to load API data')); // Error occurred
  }, []);

  return (
    <div className="todo-container">
      <h2 className="header">Fetched Todos</h2>

      {/* If an error occurred while fetching, display the error and a retry button */}
      {error && (
        <div className="error">
          <p>{error}</p>
          {/* Refreshes the page to retry fetching data */}
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Toggle button to show/hide completed todos */}
      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="toggle-btn"
      >
        {showCompleted ? 'Hide Completed' : 'Show Completed'}
      </button>

      {/* Displays a list of todos, filtered based on showCompleted state */}
      <ul className="task-list">
        {apiTodos
          .filter(todo => (showCompleted ? true : !todo.completed))
          .map(todo => (
            <li
              key={todo.id}
              className={`task-item ${todo.completed ? 'completed' : ''}`}
            >
              {/* Show the todo title and the user ID who owns it */}
              <span>{todo.title}</span> <small>(User {todo.userId})</small>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FetchedTodos;
