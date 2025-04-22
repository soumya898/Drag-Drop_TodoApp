

import React, { useState, useEffect } from "react";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const updateTasks = (newTasks) => {
    setHistory([...history, tasks]);
    setFuture([]);
    setTasks(newTasks);
  };

  // Add new task with loading state
  const addTask = () => {
    if (taskInput.trim() === "") {
      setShowWarning(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newTask = {
        id: Date.now().toString(),
        text: taskInput,
        completed: false,
      };
      updateTasks([...tasks, newTask]);
      setTaskInput("");
      setIsLoading(false);
    }, 500);
  };

  // Delete task
  const deleteTask = (id) => {
    updateTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle complete
  const toggleComplete = (id) => {
    updateTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle drag-and-drop reordering
  const handleDrop = (e, dropIndex) => {
    // Get the dragged task index
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) return;   // Ignore if the dragged task is dropped in the same position

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(dropIndex, 0, movedTask);
    updateTasks(updatedTasks);
  };

  // Undo and  Undo function to revert to the previous state of tasks
  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(history.slice(0, history.length - 1));
    setFuture([tasks, ...future]);
    setTasks(previous);
  };
  // Redo function to reapply a previously undone change
  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(future.slice(1));
    setHistory([...history, tasks]);
    setTasks(next);
  };

  // Filter tasks based on search
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="todo-container">
      <h1>Todo App</h1>

      {/* Task Input */}
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Controls */}
      <div className="controls">
        <button onClick={undo} disabled={history.length === 0}>Undo</button>
        <button onClick={redo} disabled={future.length === 0}>Redo</button>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="warning">
          ⚠️ Task cannot be empty!
          <button onClick={() => setShowWarning(false)}>X</button>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && <div className="spinner"></div>}

      {/* Task List */}
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
                <input className="editinput"
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (editText.trim() !== "") {
                      updateTasks(tasks.map(t =>
                        t.id === task.id ? { ...t, text: editText } : t
                      ));
                      setEditingId(null);
                    }
                  }}
                >Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
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
                    setEditText(task.text);
                  }}>🖋️</button>
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
