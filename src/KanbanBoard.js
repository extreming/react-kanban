import KanbanColumn from "./KanbanColumn"
import { useState } from "react"

export default function KanbanBoard({loading, todoList, ongoingList, doneList, onAdd, onRemove}) {
  const [dragItem, setDragItem] = useState(null)
  const [dragSource, setDragSource] = useState(null)
  const [dragTarget, setDragTarget] = useState(null)

  const handleDrop = (evt) => {
    if (!dragItem || !dragSource || !dragTarget || dragSource === dragTarget) {
      return
    }

    dragSource && onRemove(dragSource, dragItem)

    dragTarget && onAdd(dragTarget, dragItem)
  }

  return (
    <main className="kanban-board">
      {
        loading ? (
          <KanbanColumn className="loading" title={'读取中...'}></KanbanColumn>
        ) : (<>
          <KanbanColumn
            className="column-todo"
            title="待处理"
            onDrop={handleDrop} 
            handleDragSource={(isSource) => setDragSource(isSource ? 'todo' : null)}
            handleDragTarget={(isTarget) => setDragTarget(isTarget ? 'todo' : null)}
            cardList={todoList}
            setDraggedItem={setDragItem}
            canAddNew={true}
            onAdd={onAdd.bind(null, 'todo')}
          />
          <KanbanColumn
            className="column-ongoing"
            title="进行中"
            onDrop={handleDrop}
            handleDragSource={(isSource) => setDragSource(isSource ? 'ongoing' : null)}
            handleDragTarget={(isTarget) => setDragTarget(isTarget ? 'ongoing' : null)}
            cardList={ongoingList}
            setDraggedItem={setDragItem}
          />
          <KanbanColumn
            className="column-done"
            title="已完成"
            onDrop={handleDrop}
            handleDragSource={(isSource) => setDragSource(isSource ? 'done' : null)}
            handleDragTarget={(isTarget) => setDragTarget(isTarget ? 'done' : null)}
            cardList={doneList}
            setDraggedItem={setDragItem}
            onRemove={onRemove.bind(null, 'done')}
          />
        </>)
      }
    </main>
  )
}
