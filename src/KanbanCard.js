import { useState, useEffect } from 'react'

const MINUTE = 60 * 1000
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const YEAR = DAY * 365
export default function KanbanCard({ title, status, dragStart }) {
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
