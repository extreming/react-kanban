import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState([
    { title: '开发任务-1', status: '2023-05-22 18:15' },
    { title: '开发任务-3', status: '2024-05-22 18:15' },
    { title: '开发任务-5', status: '2021-05-22 18:15' },
    { title: '测试任务-3', status: '2024-05-23 18:15' }
  ]);
  const [ongoingList, setOngoingList] = useState([
    { title: '开发任务-4', status: '2022-05-22 18:15' },
    { title: '开发任务-6', status: '2023-05-22 18:15' },
    { title: '测试任务-2', status: '2024-05-24 14:15' }
  ]);
  const [doneList, setDoneList] = useState([
    { title: '开发任务-2', status: '2024-04-22 18:15' },
    { title: '测试任务-1', status: '2024-05-12 18:15' }
  ]);


  const handleAdd = (event) => {
    setShowAdd(true);
  };
  const handleSubmit = (title) => {
    setTodoList(todoList => [
      { title, status: new Date().toDateString() },
      ...todoList
    ]);
    setShowAdd(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        <KanbanColumn className="column-todo" title={
          <>
            <span>待处理</span> <button onClick={handleAdd}>添加新卡片</button>
          </>
        }>
          {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
          {
            todoList.map((props) => <KanbanCard {...props} />)
          }
        </KanbanColumn>
        <KanbanColumn className="column-ongoing" title="进行中">
          {
            ongoingList.map((props) => <KanbanCard {...props} />)
          }
        </KanbanColumn>
        <KanbanColumn className="column-done" title="已完成">
          {
            doneList.map((props) => <KanbanCard {...props} />)
          }
        </KanbanColumn>
      </KanbanBoard>
    </div >
  );
}

const KanbanBoard = ({ children }) => {
  return (
    <main className="kanban-board">{children}</main>
  );
};

const KanbanColumn = ({ children, className, title }) => {
  const mergeClassName = `kanban-column ${className}`

  return (
    <section className={mergeClassName}>
      <h2>{title}</h2>
      <ul>
        {children}
      </ul>
    </section>
  );
};


const MINUTE = 60 * 1000;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const YEAR = DAY * 365;
const KanbanCard = ({ title, status }) => {
  const [displayTime, setDisplayTime] = useState(status);
  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date() - new Date(status);
      let relativeTime = '刚刚';
      if (timePassed > MINUTE && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)}分钟前`
      } else if (timePassed > HOUR && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)}小时前`
      } else if (timePassed > DAY && timePassed < YEAR) {
        relativeTime = `${Math.ceil(timePassed / DAY)}天前`
      } else if (timePassed > YEAR) {
        relativeTime = `${Math.ceil(timePassed / YEAR)}年前`
      }
      setDisplayTime(relativeTime);
    }
    const intervalId = setInterval(updateDisplayTime, MINUTE);
    updateDisplayTime();

    return function cleanup() {
      clearInterval(intervalId);
    }
  }, [status])
  return (
    <li className="kanban-card">
      <div className="card-title">{title}</div>
      <div className="card-status">{displayTime}</div>
    </li>
  );
};

const KanbanNewCard = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const handleChange = (event) => {
    setTitle(event.target.value);
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit(title);
    }
  }

  const inputElement = useRef(null);
  useEffect(() => {
    inputElement.current.focus();
  }, [])

  return (
    <li className="kanban-card">
      <h3>添加新卡片</h3>
      <div className="card-title">
        <input ref={inputElement} type="text" value={title} onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  );
};

export default App;