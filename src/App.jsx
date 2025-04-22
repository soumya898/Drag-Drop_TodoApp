
import TodoApp from './assets/TodoApp'

import React, { useState } from 'react';
import FetchedTodos from './assets/FetchedTodos';

const App = () => {
  const [activeTab, setActiveTab] = useState('local');

  return (
    <div className="todo-container">

      
       <div className="tab-buttons">
        <button onClick={() => setActiveTab('local')} className={activeTab === 'local' ? 'active-tab' : ''}>Local Todos</button>
        <button onClick={() => setActiveTab('api')} className={activeTab === 'api' ? 'active-tab' : ''}>API Todos</button>
      </div>

      {activeTab === 'local' ? <TodoApp /> : <FetchedTodos />} 






   
    </div>
  );
};

export default App;