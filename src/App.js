import logo from './logo.svg'
import './App.css'
import { useState, useEffect } from 'react'
import KanbanBoard from './KanbanBoard'
import AdminContext from './context/AdminContext'

function App() {
  const [todoList, setTodoList] = useState([
    { title: '开发任务-1', status: '2023-05-22 18:15' },
    { title: '开发任务-3', status: '2024-05-22 18:15' },
    { title: '开发任务-5', status: '2021-05-22 18:15' },
    { title: '测试任务-3', status: '2024-05-23 18:15' }
  ])
  const [ongoingList, setOngoingList] = useState([
    { title: '开发任务-4', status: '2022-05-22 18:15' },
    { title: '开发任务-6', status: '2023-05-22 18:15' },
    { title: '测试任务-2', status: '2024-05-24 14:15' }
  ])
  const [doneList, setDoneList] = useState([
    { title: '开发任务-2', status: '2024-04-22 18:15' },
    { title: '测试任务-1', status: '2024-05-12 18:15' }
  ])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const updaters = {
    'todo': setTodoList,
    'ongoing': setOngoingList,
    'done': setDoneList
  }

  const handleSaveCards = () => {
    let cards = {
      todoList,
      ongoingList,
      doneList
    }
    localStorage.setItem('cards', JSON.stringify(cards))
  }

  useEffect(() => {
    setTimeout(() => {
      const cards = JSON.parse(localStorage.getItem('cards'))
      if (cards) {
        setTodoList(cards.todoList)
        setOngoingList(cards.ongoingList)
        setDoneList(cards.doneList)
      }
      setLoading(false)
    }, 1000)
  }, [])

  const handleAdd = (column, newCard) => {
    updaters[column](currentStat => [newCard, ...currentStat])
  }

  const handleRemove = (column, cardToRemove) => {
    updaters[column](currentStat => currentStat.filter(item => item.title !== cardToRemove.title))
  }

  const handleToggleAdmin = () => {
    setIsAdmin(!isAdmin)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          我的看板
          <button onClick={handleSaveCards}>保存所有卡片</button>
          <label>
            <input type="checkbox" value={isAdmin} onChange={handleToggleAdmin} />
            管理员模式
          </label>
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <AdminContext.Provider value={isAdmin}>
        <KanbanBoard loading={loading} todoList={todoList} ongoingList={ongoingList} doneList={doneList} onAdd={handleAdd} onRemove={handleRemove} />
      </AdminContext.Provider>
    </div >
  )
}

export default App