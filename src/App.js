import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState([
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' }
  ]);
  const [ongoingList, setOngoingList] = useState([
    { title: '开发任务-4', status: '22-05-22 18:15' },
    { title: '开发任务-6', status: '22-05-22 18:15' },
    { title: '测试任务-2', status: '22-05-22 18:15' }
  ]);
  const [doneList, setDoneList] = useState([
    { title: '开发任务-2', status: '22-05-22 18:15' },
    { title: '测试任务-1', status: '22-05-22 18:15' }
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

const KanbanCard = ({ title, status }) => {
  return (
    <li className="kanban-card">
      <div className="card-title">{title}</div>
      <div className="card-status">{status}</div>
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

  return (
    <li className="kanban-card">
      <h3>添加新卡片</h3>
      <div className="card-title">
        <input type="text" value={title} onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  );
};

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

export default App;