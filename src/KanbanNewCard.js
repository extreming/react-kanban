import { useState, useEffect, useRef } from 'react'

export default function KanbanNewCard({ onSubmit }) {
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
