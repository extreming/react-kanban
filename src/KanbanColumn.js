import KanbanCard from "./KanbanCard"
import KanbanNewCard from "./KanbanNewCard"
import { useState } from "react"

export default function KanbanColumn({children, className, title, handleDragSource, handleDragTarget, onDrop, cardList = [], setDraggedItem, canAddNew, onAdd }) {
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

  const [showAdd, setShowAdd] = useState(false)
  const handleAdd = () => {
    setShowAdd(true)
  }

  const handleSubmit = (title) => {
    onAdd && onAdd(title)
    setShowAdd(false)
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
      <h2>
        {title}
        {
          canAddNew && (
            <button onClick={handleAdd} disabled={showAdd}>&#8853; 添加新卡片</button>
          )
        }
      </h2>
      <ul>
        {
          canAddNew && showAdd && <KanbanNewCard onSubmit={handleSubmit} />
        }
        {
          cardList.map(props => (<KanbanCard key={props.title} onDragStart={() => setDraggedItem && setDraggedItem(props)} {...props} />))
        }
      </ul>
    </section>
  )
}
