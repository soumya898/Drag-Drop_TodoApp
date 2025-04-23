

# React To-Do App with Drag-and-Drop

This is a simple **React-based To-Do application** that supports **drag-and-drop task reordering**, task completion, and editing. Tasks are persisted across sessions using `localStorage`.

## Features

- **Add New Tasks:** Allows users to add new tasks.
- **Complete/Incomplete Tasks:** Users can mark tasks as complete/incomplete.
- **Edit Tasks:** Users can edit existing tasks.
- **Drag-and-Drop Reordering:** Users can reorder tasks by dragging and dropping them.
- **Undo/Redo:** You can undo and redo task changes.
- **Search Tasks:** Users can search tasks by their text content.
- **Task Persistence:** Tasks are saved in `localStorage`, so they persist across sessions.
- **Warning Modal:** Displays a warning if the task input is empty.

## Technologies Used

- **React:** For building the user interface.
- **CSS:** For styling the components.
- **localStorage:** To persist tasks across sessions.

## Installation Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/react-to-do-drag-drop.git
```

2. **Navigate to the project folder:**

```bash
cd react-to-do-drag-drop
```

3. **Install the dependencies:**

```bash
npm install
```

4. **Start the app:**

```bash
npm start
```

You can view the app in your browser at `http://localhost:5173`.

## How to Contribute

Feel free to fork this repository, make changes, and submit pull requests!

### 1. **Fork the repository**
   - Click the **Fork** button in the top-right corner of the project page.

### 2. **Clone your forked repository**
   - Clone it to your local machine:
   ```bash
   git clone[ ](https://github.com/soumya898/Drag-Drop_TodoApp.git)
   ```

### 3. **Make changes**
   - Navigate to the project folder and make your changes.

### 4. **Push your changes**
   - After making your changes, commit them and push them back to your forked repository:
   ```bash
   git add .
   git commit -m "Add new feature or fix bug"
   git push origin master
   ```

### 5. **Create a pull request**
   - After pushing your changes, visit the original repository and click on the "New Pull Request" button.

## License

This project is licensed under the **MIT License**.

## Documentation

### Features Implemented
- **Task Management:** Add, delete, complete, and edit tasks.
- **Drag-and-Drop:** Rearrange tasks using drag-and-drop.
- **Undo/Redo:** Keep track of task changes and revert if needed.
- **Search Functionality:** Filter tasks based on search query.
- **Persistence:** Store tasks in `localStorage` for persistence.

### Challenges Faced
- **Drag-and-Drop Logic:** The drag-and-drop reordering was a bit tricky due to the complexity of managing state changes while maintaining the correct order of tasks.
- **Undo/Redo Functionality:** Implementing undo and redo required careful tracking of task states to ensure accurate restoration of previous tasks.
- **LocalStorage Handling:** Persisting tasks and keeping them updated in `localStorage` while maintaining performance was challenging.

### Code Explanation

```javascript
// Handle the drag-and-drop reordering of tasks
const handleDrop = (e, dropIndex) => {
  // Get the dragged task index from the dataTransfer object
  const dragIndex = Number(e.dataTransfer.getData("text/plain"));

  // Ignore if the dragged task is dropped in the same position
  if (dragIndex === dropIndex) return;

  // Reorder the tasks by removing the dragged task and inserting it at the new position
  const updatedTasks = [...tasks];
  const [movedTask] = updatedTasks.splice(dragIndex, 1);
  updatedTasks.splice(dropIndex, 0, movedTask);

  // Update the state with the new task order
  updateTasks(updatedTasks);
};
```

---

Once you've completed your edits, follow the steps below to push your changes:

### Push Updates
```bash
git add README.md
git commit -m "Added README with features and challenges"
git push origin master
```



<img width="553" alt="image" src="https://github.com/user-attachments/assets/aeaba848-25d0-4d29-9a9f-6125dc682f78" />


Identified 4 Issue are 

1. State Mutation:  Here splice()  directed mutated item array which is not good way to state update in react componenet insted   we can use filter() method to create new array .
2.  Missing  key pro :  when   iterate  over map method each child element must have unique key to effeciently Update DOM.
3.  Each item should be wrapped inside a div with a proper key to avoid rendering issues.

4. The setItems(items) doesn't create a new reference,  may potentially causing re-render issues.

     i found these 4 issue on above  code template



   if i refactor it then   code could be


 ### Updated Code

   ```javascript
        import React, { useState } from "react";

          function TodoList({ todos }) {
          const [items, setItems] = useState(todos);
 
   const deleteTodo = (index) => {
  
    setItems(items.filter((_, i) => i !== index)); // Avoids state mutation
    };

   return (
    <div>
      {items.map((todo, index) => (
      
        <div key={todo.id || index}>
        
        {/* Unique key for rendering efficiency */}
          <p>{todo.title}</p>
          <button onClick={() => deleteTodo(index)}>Delete</button>
        </div>
      ))}
    </div>
   );
    }
   ```
  
   









