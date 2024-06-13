import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    setTasks(response.data);
  };
  
  const addTask = async () => {
      const response = await axios.post('http://localhost:5000/tasks', { text: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
  };
  
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const updateTask = async (id) => {
      const response = await axios.put(`http://localhost:5000/tasks/${id}`, { text: editingText });
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
      setEditingTask(null);
      setEditingText('');
  };
  

  return (
    <div className="App">
      <h1>Elenco delle Attività</h1>
      <h1>---------------------</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {editingTask === task.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => updateTask(task.id)}>Salva</button>
                <button onClick={() => setEditingTask(null)}>Annulla</button>
              </>
            ) : (
              <>
                {task.text}
                <button onClick={() => {
                  setEditingTask(task.id);
                  setEditingText(task.text);
                }}>Modifica</button>
                <button onClick={() => deleteTask(task.id)}>Elimina</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Aggiungi Attività</button>
    </div>
  );
};

export default App;
