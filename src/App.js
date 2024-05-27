import logo from './logo.svg'
import './App.css'
import { useState, useEffect, useRef } from 'react'

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

const KanbanBoard = ({ children }) => {
  return (
    <main className="kanban-board">{children}</main>
  )
}

const KanbanColumn = ({ children, className, title, handleDragSource, handleDragTarget, onDrop }) => {
  const mergeClassName = `kanban-column ${className}`

  const handleDragStart = (evt) => {
    handleDragSource(true)
  }

  const handleDragOver = (evt) => {
    evt.preventDefault()
    evt.dataTransfer.dropEffect = 'move'
    handleDragTarget(true)
  }
  const handleDragLeave = (evt) => {
    evt.preventDefault()
    evt.dataTransfer.dropEffect = 'none'
    handleDragTarget(false)
  }
  const handleDrop = (evt) => {
    evt.preventDefault()
    onDrop && onDrop()
  }
  const handleDragEnd = (evt) => { 
    evt.preventDefault() 
    handleDragTarget(true)
  }

  return (
    <section
      className={mergeClassName}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      <h2>{title}</h2>
      <ul>
        {children}
      </ul>
    </section>
  )
}


const MINUTE = 60 * 1000
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const YEAR = DAY * 365
const KanbanCard = ({ title, status, dragStart }) => {
  const [displayTime, setDisplayTime] = useState(status)
  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date() - new Date(status)
      let relativeTime = '刚刚'
      if (timePassed > MINUTE && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)}分钟前`
      } else if (timePassed > HOUR && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)}小时前`
      } else if (timePassed > DAY && timePassed < YEAR) {
        relativeTime = `${Math.ceil(timePassed / DAY)}天前`
      } else if (timePassed > YEAR) {
        relativeTime = `${Math.ceil(timePassed / YEAR)}年前`
      }
      setDisplayTime(relativeTime)
    }
    const intervalId = setInterval(updateDisplayTime, MINUTE)
    updateDisplayTime()

    return function cleanup() {
      clearInterval(intervalId)
    }
  }, [status])

  const handleDragStart = (evt) => {
    evt.dataTransfer.effectAllowed = 'move'
    evt.dataTransfer.setData('text/plain', title)
    dragStart && dragStart(evt)
  }

  return (
    <li className="kanban-card" draggable onDragStart={handleDragStart}>
      <div className="card-title">{title}</div>
      <div className="card-status">{displayTime}</div>
    </li>
  )
}

const KanbanNewCard = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const handleChange = (event) => {
    setTitle(event.target.value)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit(title)
    }
  }

  const inputElement = useRef(null)
  useEffect(() => {
    inputElement.current.focus()
  }, [])

  return (
    <li className="kanban-card">
      <h3>添加新卡片</h3>
      <div className="card-title">
        <input ref={inputElement} type="text" value={title} onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  )
}

export default App