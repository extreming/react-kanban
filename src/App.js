import logo from './logo.svg'
import './App.css'
import { useState, useEffect } from 'react'
import KanbanBoard from './KanbanBoard'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import KanbanNewCard from './KanbanNewCard'

function App() {
  const [showAdd, setShowAdd] = useState(false)
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


  const handleAdd = (event) => {
    setShowAdd(true)
  }
  const handleSubmit = (title) => {
    setTodoList(todoList => [
      { title, status: new Date().toDateString() },
      ...todoList
    ])
    setShowAdd(false)
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

  const [loading, setLoading] = useState(true)

  const [dragItem, setDragItem] = useState(null)
  const [dragSource, setDragSource] = useState(null)
  const [dragTarget, setDragTarget] = useState(null)


  const handleDrop = (evt) => {
    if (!dragItem || !dragSource || !dragTarget || dragSource === dragTarget) {
      return
    }

    const updaters = {
      'todo': setTodoList,
      'ongoing': setOngoingList,
      'done': setDoneList
    }

    if (dragSource) {
      updaters[dragSource]((currentStat) => 
        currentStat.filter((item) => !Object.is(item, dragItem))
      )
    }

    if (dragTarget) {
      updaters[dragTarget]((currentStat) => [dragItem, ...currentStat])
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleSaveCards}>保存所有卡片</button>
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        {
          loading ? (
            <KanbanColumn className="loading" title={'读取中...'}></KanbanColumn>
          ) : (<>
            <KanbanColumn
              className="column-todo"
              title={
                <>
                  <span>待处理</span> <button onClick={handleAdd}>添加新卡片</button>
                </>
              } 
              onDrop={handleDrop} 
              handleDragSource={(isSource) => setDragSource(isSource ? 'todo' : null)}
              handleDragTarget={(isTarget) => setDragTarget(isTarget ? 'todo' : null)}
            >
              {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
              {
                todoList.map((props, index) => <KanbanCard {...props} key={props.title} dragStart={() => setDragItem(props)} />)
              }
            </KanbanColumn>
            <KanbanColumn
              className="column-ongoing"
              title="进行中"
              onDrop={handleDrop}
              handleDragSource={(isSource) => setDragSource(isSource ? 'ongoing' : null)}
              handleDragTarget={(isTarget) => setDragTarget(isTarget ? 'ongoing' : null)}
            >
              {
                ongoingList.map((props, index) => <KanbanCard {...props} key={props.title} dragStart={() => setDragItem(props)} />)
              }
            </KanbanColumn>
            <KanbanColumn
              className="column-done"
              title="已完成"
              onDrop={handleDrop}
              handleDragSource={(isSource) => setDragSource(isSource ? 'done' : null)}
              handleDragTarget={(isTarget) => setDragTarget(isTarget ? 'done' : null)}
            >
              {
                doneList.map((props, index) => <KanbanCard {...props} key={props.title} dragStart={() => setDragItem(props)} />)
              }
            </KanbanColumn>
          </>)
        }
      </KanbanBoard>
    </div >
  )
}

export default App