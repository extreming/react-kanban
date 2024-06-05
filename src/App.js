import logo from './logo.svg'
import './App.css'
import { useState, useEffect } from 'react'
import KanbanBoard from './KanbanBoard'

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

  const [loading, setLoading] = useState(true)

  const updaters = {
    'todo': setTodoList,
    'ongoing': setOngoingList,
    'done': setDoneList
  }

  const handleAdd = (column, newCard) => {
    updaters[column](currentStat => [newCard, ...currentStat])
  }

  const handleRemove = (column, cardToRemove) => {
    updaters[column](currentStat => currentStat.filter(item => !Object.is(item, cardToRemove)))
  }


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleSaveCards}>保存所有卡片</button>
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard loading={loading} todoList={todoList} ongoingList={ongoingList} doneList={doneList} onAdd={handleAdd} onRemove={handleRemove} />
    </div >
  )
}

export default App