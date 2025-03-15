import { useEffect, useState } from 'react';
import { FaTrash } from "react-icons/fa6";
import { FaSquareCheck } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiKeyReturnFill } from "react-icons/pi";

import './App.css';

const App = () => {
  const [todos,setTodos] = useState(()=>{
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos):[]
  })
  const [text, setText] = useState('');
  const [priority,setPrioroty] = useState('moyenne')
  const [choix,setChoix] = useState(1)
  const [date,setDate] = useState(new Date())
  const [dateLimit,setDateLimit] = useState('')

  useEffect(()=>{
    const interval = setInterval(()=>{
      setDate(new Date())
    },1000)

    return ()=> clearInterval(interval)
  },[])
  
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  const format = `${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}`:minutes}`


  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, completed: false, priority,dateLimit };
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos, newTodo];
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    });
  };

  const removeTodo = (id) =>{
    setTodos((prevTodos) =>{
      const updatedTodos = prevTodos.filter((todo) => todo.id !== id)
      localStorage.setItem('todos',JSON.stringify(updatedTodos))
      return updatedTodos
    })
  }

  const finishTodo = (id) =>{
    setTodos((prevTodos) =>{
      const updatedTodos = prevTodos.map((todo)=>{
        if(todo.id === id){
          return {...todo, completed:true}
        }
        return todo
      })
      localStorage.setItem('todos',JSON.stringify(updatedTodos))
      return updatedTodos
    })
  }

  const noFinishTodo = (id) =>{
    setTodos((prevTodos) =>{
      const updatedTodos = prevTodos.map((todo) =>{
        if(todo.id === id){
          return {...todo,completed:false}
        }
        return todo
      })
      localStorage.setItem('todos',JSON.stringify(updatedTodos))
      return updatedTodos
    })
  }

  const submitForm = (e) =>{
    e.preventDefault()
    if(!text.trim()) return
    addTodo(text)
    setText('')
    setDateLimit('2025-03-15')
  }

  const handleChange = (e) =>{
    setText(e.target.value)
  }

  const handleChangePrio = (e) =>{
    setPrioroty(e.target.value)
  }

  const handleChangeDate = (e) =>{
    setDateLimit(e.target.value)
  }

  return (
    <div id='mere'>
      <h1>Liste des tâches à faire</h1>

      <p>{format}</p>

      <div id='form'>
        <form onSubmit={submitForm}>
          <textarea type='text' value={text} onChange={handleChange} placeholder='Tâche à faire...'/>
          <fieldset>
            <legend>Importance :</legend>
            <p>
              <input type='radio' id='h' name='priority' value='haute' checked={priority === 'haute'} onChange={handleChangePrio} />
              <label htmlFor='h'>Haute</label>
            </p>
            <p>
              <input type='radio' id='m' name='priority' value='moyenne' checked={priority === 'moyenne'} onChange={handleChangePrio} />
              <label htmlFor='m'>Moyenne</label>
            </p>
            <p>
              <input type='radio' id='b' name='priority' value='basse' checked={priority === 'basse'} onChange={handleChangePrio} />
              <label htmlFor='b'>Basse</label>
            </p>
          </fieldset>
          <label htmlFor="date">Date limite</label>
          <input type='date' id='date' name='dateLimit' onChange={handleChangeDate} value={dateLimit} min={new Date().toISOString().split("T")[0]} required pattern='d\{2}/\d{2}/\d{4}' />
          <button type='submit'>Ajouter</button>
        </form>
      </div>

      <div id='content'>
        <div id='menu'>
          <button onClick={() => setChoix(1)}>Tout</button>
          <button onClick={() => setChoix(2)}>Finie</button>
          <button onClick={() => setChoix(3)}>Non finie</button>
          <button onClick={() => setChoix(4)}>Importante</button>
          <button onClick={() => setChoix(5)}>Moyenne</button>
          <button onClick={() => setChoix(6)}>Basse</button>
        </div>

        {
          choix === 1 ?
            <div>
                {todos.map((todo)=>(
                  <div key={todo.id} id='todo' style={{boxShadow: todo.completed ? '0px 0px 8px 3px white'
                    : todo.priority === 'haute' ? '0px 0px 8px 3px red'
                    : todo.priority === 'moyenne' ? '0px 0px 8px 3px yellow'
                    : '0px 0px 8px 3px green'
                    }}>
                    <p style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>{todo.text}</p>
                    <h6>Date limite : {todo.dateLimit}</h6>  
                    <button style={{color:'red'}} onClick={() => removeTodo(todo.id)}><FaTrash /></button>
                    {todo.completed ? (
                      <button style={{color:'green'}} onClick={() => noFinishTodo(todo.id)}><PiKeyReturnFill /></button>
                    )
                    : (
                      <button style={{color:'blue'}} onClick={() => finishTodo(todo.id)}><FaSquareCheck /></button>
                    )}
                  </div>
                ))}
            </div>

          : choix === 2 ?
            <div>
              {todos.map((todo)=>(
                <div key={todo.id} id='todo' style={{boxShadow: todo.completed ? '0px 0px 8px 3px white'
                  : todo.priority === 'haute' ? '0px 0px 8px 3px red'
                  : todo.priority === 'moyenne' ? '0px 0px 8px 3px yellow'
                  : '0px 0px 8px 3px green',
                  display: todo.completed ? 'block' : 'none'
                  }}>
                  <p style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>{todo.text}</p>
                  <h6>Date limite : {todo.dateLimit}</h6>
                  <button style={{color:'red'}} onClick={() => removeTodo(todo.id)}>Supprimer</button>
                  {todo.completed ? (
                    <button style={{color:'green'}} onClick={() => noFinishTodo(todo.id)}>Revenir</button>
                  )
                  : (
                    <button style={{color:'blue'}} onClick={() => finishTodo(todo.id)}>Completer</button>
                  )}
                </div>
              ))}
            </div>

          :choix === 3 ?
            <div>
              {todos.map((todo)=>(
                <div key={todo.id} id='todo' style={{boxShadow: todo.completed ? '0px 0px 8px 3px white'
                  : todo.priority === 'haute' ? '0px 0px 8px 3px red'
                  : todo.priority === 'moyenne' ? '0px 0px 8px 3px yellow'
                  : '0px 0px 8px 3px green',
                  display: todo.completed ? 'none' : 'block'
                  }}>
                  <p style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>{todo.text}</p>
                  <h6>Date limite : {todo.dateLimit}</h6>
                  <button style={{color:'red'}} onClick={() => removeTodo(todo.id)}>Supprimer</button>
                  {todo.completed ? (
                    <button style={{color:'green'}} onClick={() => noFinishTodo(todo.id)}>Revenir</button>
                  )
                  : (
                    <button style={{color:'blue'}} onClick={() => finishTodo(todo.id)}>Completer</button>
                  )}
                </div>
              ))}
            </div>

          : choix === 4 ?
            <div>
                {todos.map((todo)=>(
                  <div key={todo.id} id='todo' style={{boxShadow: todo.completed ? '0px 0px 8px 3px white'
                    : todo.priority === 'haute' ? '0px 0px 8px 3px red'
                    : todo.priority === 'moyenne' ? '0px 0px 8px 3px yellow'
                    : '0px 0px 8px 3px green'
                    , display: todo.priority === 'haute' ? 'block' : 'none'
                    }}>
                    <p style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>{todo.text}</p>  
                    <h6>Date limite : {todo.dateLimit}</h6>
                    <button style={{color:'red'}} onClick={() => removeTodo(todo.id)}>Supprimer</button>
                    {todo.completed ? (
                      <button style={{color:'green'}} onClick={() => noFinishTodo(todo.id)}>Revenir</button>
                    )
                    : (
                      <button style={{color:'blue'}} onClick={() => finishTodo(todo.id)}>Completer</button>
                    )}
                  </div>
                ))}
            </div>

          : choix === 5 ?
            <div>
                {todos.map((todo)=>(
                  <div key={todo.id} id='todo' style={{boxShadow: todo.completed ? '0px 0px 8px 3px white'
                    : todo.priority === 'haute' ? '0px 0px 8px 3px red'
                    : todo.priority === 'moyenne' ? '0px 0px 8px 3px yellow'
                    : '0px 0px 8px 3px green'
                    , display: todo.priority === 'moyenne' ? 'block' : 'none'
                    }}>
                    <p style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>{todo.text}</p>  
                    <h6>Date limite : {todo.dateLimit}</h6>
                    <button style={{color:'red'}} onClick={() => removeTodo(todo.id)}>Supprimer</button>
                    {todo.completed ? (
                      <button style={{color:'green'}} onClick={() => noFinishTodo(todo.id)}>Revenir</button>
                    )
                    : (
                      <button style={{color:'blue'}} onClick={() => finishTodo(todo.id)}>Completer</button>
                    )}
                  </div>
                ))}
            </div>

          : 
            <div>
                {todos.map((todo)=>(
                  <div key={todo.id} id='todo' style={{boxShadow: todo.completed ? '0px 0px 8px 3px white'
                    : todo.priority === 'haute' ? '0px 0px 8px 3px red'
                    : todo.priority === 'moyenne' ? '0px 0px 8px 3px yellow'
                    : '0px 0px 8px 3px green'
                    , display: todo.priority === 'basse' ? 'block' : 'none'
                    }}>
                    <p style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>{todo.text}</p>  
                    <h6>Date limite : {todo.dateLimit}</h6>
                    <button style={{color:'red'}} onClick={() => removeTodo(todo.id)}>Supprimer</button>
                    {todo.completed ? (
                      <button style={{color:'green'}} onClick={() => noFinishTodo(todo.id)}>Revenir</button>
                    )
                    : (
                      <button style={{color:'blue'}} onClick={() => finishTodo(todo.id)}>Completer</button>
                    )}
                  </div>
                ))}
            </div>
        }
      </div>
    </div>
  )
}

export default App;
