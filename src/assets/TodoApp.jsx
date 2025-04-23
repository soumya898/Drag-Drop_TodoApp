import React, { useState, useEffect } from "react";

/*
 * Main component that renders the Todo application.
 * It handles all the functionality including task creation, editing,
 * deletion, persistence, searching, undo/redo, and drag-and-drop reordering.
 */
const TodoApp = () => {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState([]);

  // State to track input for new task
  const [taskInput, setTaskInput] = useState("");

  // State to handle live search/filter functionality
  const [searchQuery, setSearchQuery] = useState("");

  // Boolean to show a warning if user tries to add an empty task
  const [showWarning, setShowWarning] = useState(false);

  // Shows a spinner while simulating a loading state during task addition
  const [isLoading, setIsLoading] = useState(false);

  // Stores the history of tasks for undo functionality
  const [history, setHistory] = useState([]);

  // Stores future states for redo functionality
  const [future, setFuture] = useState([]);

  // Keeps track of the task currently being edited (if any)
  const [editingId, setEditingId] = useState(null);

  // Stores temporary text value while editing a task
  const [editText, setEditText] = useState("");

  // On initial mount, load tasks from localStorage if any exist
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /**
   * Updates the task list with a new state.
   * Also pushes the current state to the `history` stack for undo,
   * and clears the `future` stack (redo) since redo only makes sense after an undo.
   */
  const updateTasks = (newTasks) => {
    setHistory([...history, tasks]);
    setFuture([]); // Once new change is made, future is no longer valid
    setTasks(newTasks);
  };

  /**
   * Adds a new task to the list.
   * If the input is empty, show a warning message.
   * Simulates a brief loading state before adding the task.
   */
  const addTask = () => {
    if (taskInput.trim() === "") {
      setShowWarning(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newTask = {
        id: Date.now().toString(), // Unique ID based on timestamp
        text: taskInput,
        completed: false,
      };
      updateTasks([...tasks, newTask]); // Add to task list
      setTaskInput(""); // Clear input field
      setIsLoading(false); // Stop loading spinner
    }, 500);
  };

  // Deletes a task by filtering it out using its ID
  const deleteTask = (id) => {
    updateTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggles the completion status of a task
  const toggleComplete = (id) => {
    updateTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   * Handles reordering of tasks via drag and drop.
   * Accepts the dragged item's original index and the new drop index,
   * and rearranges the task array accordingly.
   */
  const handleDrop = (e, dropIndex) => {
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) return; // Prevent unnecessary updates

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(dragIndex, 1); // Remove dragged task
    updatedTasks.splice(dropIndex, 0, movedTask); // Insert at drop index
    updateTasks(updatedTasks);
  };

  // Reverts the task list to the previous state from the history stack
  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(history.slice(0, history.length - 1));
    setFuture([tasks, ...future]); // Save current state in redo history
    setTasks(previous);
  };

  // Reapplies a previously undone change using the future stack
  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(future.slice(1));
    setHistory([...history, tasks]); // Save current state before redo
    setTasks(next);
  };

  // Filters the tasks in real-time based on the search query input
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="todo-container">
      <h1>React  Drag Drop Todo App</h1>

      {/* Input section for adding a new task */}
      <div className="task-input" style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Search field for live filtering of tasks */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Undo and Redo controls */}
      <div className="controls">
        <button onClick={undo} disabled={history.length === 0}>Undo</button>
        <button onClick={redo} disabled={future.length === 0}>Redo</button>
      </div>

     {/* Displays a warning if user attempts to add an empty task */}
{showWarning && (
  <div className="notification-container">
    <div className="notification">
      <span>⚠️ Task cannot be empty!</span>
      <button className="close-btn" onClick={() => setShowWarning(false)}>X</button>
    </div>
  </div>
)}



      {/* Spinner shown during task add delay */}
      {isLoading && <div className="spinner"></div>}

      {/* List of tasks with drag-and-drop, edit, delete, and complete toggle */}
      <ul className="task-list" onDragOver={(e) => e.preventDefault()}>
        {filteredTasks.map((task, index) => (
          <li
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`task-item ${task.completed ? "completed-task" : ""}`}
          >
            {editingId === task.id ? (
              <>
                <input
                  className="editinput"
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button className="save-btn"
                  onClick={() => {
                    if (editText.trim() !== "") {
                      updateTasks(
                        tasks.map(t =>
                          t.id === task.id ? { ...t, text: editText } : t
                        )
                      );
                      setEditingId(null); // Exit edit mode
                    }
                  }}
                >Save</button>
                <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
                <button
                  onClick={() => {
                    setEditingId(task.id);
                    setEditText(task.text); // Pre-fill current text
                  }}
                >🖋️</button>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
