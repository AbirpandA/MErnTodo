import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Base URL for API requests
  const API_URL = 'https://merntodo-63ng.onrender.com';

  // Fetch todos from backend when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to fetch todos from backend using axios
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/show`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Function to handle input change
  function handleChange(e) {
    setTodo(e.target.value);
  }

  // Function to handle edit input change
  function handleEditChange(e) {
    setEditText(e.target.value);
  }

  // Function to add a new todo using axios
  async function handleAdd() {
    if (todo.trim()) {
      try {
        const response = await axios.post(`${API_URL}/addtodo`, { todo });
        setMessage(response.data.message);
        
        // Fetch updated todos after adding
        fetchTodos();
        setTodo('');
      } catch (error) {
        console.error('Error adding todo:', error);
        setMessage(error.response?.data?.message || 'Error adding todo');
      }
    }
  }

  // Function to start editing a todo
  function startEdit(item) {
    setEditingId(item.todo);
    setEditText(item.todo);
  }

  // Function to cancel editing
  function cancelEdit() {
    setEditingId(null);
    setEditText('');
  }

  // Function to save edited todo
  async function saveEdit(oldTodo) {
    if (editText.trim() && editText !== oldTodo) {
      try {
        const response = await axios.put(`${API_URL}/edittodo/${oldTodo}`, { 
          todo: editText 
        });
        setMessage(response.data.message || 'Todo updated');
        fetchTodos();
        setEditingId(null);
      } catch (error) {
        console.error('Error updating todo:', error);
        setMessage(error.response?.data?.message || 'Error updating todo');
      }
    } else {
      cancelEdit();
    }
  }

  // Function to delete a todo
  async function handleDelete(todoToDelete) {
    try {
      const response = await axios.delete(`${API_URL}/deletetodo/${todoToDelete}`, {
        data: { todo: todoToDelete }
      });
      setMessage(response.data.message || 'Todo deleted');
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setMessage(error.response?.data?.message || 'Error deleting todo');
    }
  }

  return (
    <div className="bg-slate-800 min-h-screen flex p-2 align-middle justify-center">
      <div className="m-3 bg-slate-200 flex flex-col space-y-3 text-slate-900 font-sans rounded-md w-[600px] p-5">
        <div className="addtodo">
          <h1 className='text-xl font-medium'>Add Todo</h1>
          <div className="flex items-center mt-2">
            <input
              type="text"
              onChange={handleChange}
              value={todo}
              placeholder="Enter todo"
              className="border p-1 rounded flex-grow"
            />
            <button
              onClick={handleAdd}
              className="rounded-md bg-emerald-600 text-white px-3 py-1 ml-2"
            >
              Add
            </button>
          </div>
          {message && <p className="text-sm mt-2 text-red-500">{message}</p>}
        </div>
        <div className="Todos">
          <h1 className='text-xl font-medium'>Todos</h1>
          <ul className="mt-2 space-y-2">
            {todos.length > 0 ? (
              todos.map((item, index) => (
                <li key={index} className="bg-white p-3 rounded shadow flex justify-between items-center">
                  {editingId === item.todo ? (
                    <div className="flex items-center w-full">
                      <input
                        type="text"
                        value={editText}
                        onChange={handleEditChange}
                        className="border p-1 rounded flex-grow"
                        autoFocus
                      />
                      <button 
                        onClick={() => saveEdit(item.todo)} 
                        className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEdit} 
                        className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{item.todo}</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => startEdit(item)} 
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.todo)} 
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))
            ) : (
              <p>No todos yet. Add some!</p>
            )}
          </ul>
        </div>
        <h3>Abir</h3>
      </div>
    </div>
  );
}

export default App;