export default function KanbanColumn({ children, className, title, handleDragSource, handleDragTarget, onDrop }) {
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
