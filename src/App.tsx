// STARTING POINT: the sample Task Manager (state in App with useReducer, passed down as props).
// Assignment 3: change the state shape, add actions, add a filter bar (see the handout).
import { useReducer } from 'react'
import {
    taskReducer,
    initialState,
    type Task,
    type Action,
} from './taskReducer'
import TaskRow from './TaskRow'
import type { Dispatch } from 'react'
import { FILTERS, filterTasks, countByFilter } from './filter'
import type { Filter } from './filter'
function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function addTask(formData: FormData) {
    const title = String(formData.get('title') ?? '').trim()
    if (title) dispatch({ type: 'add', id: crypto.randomUUID(), title })
  }
  return (
    <form action={addTask}>
      <input name="title" placeholder="New task" />
      <button type="submit">Add</button>
    </form>
  )
}

function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> }) {
    if (tasks.length === 0) {
        return <p>No tasks here.</p>
    }
  return (
    <ul>
      {tasks.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          onNext={() => dispatch({ type: 'advance', id: t.id })}
          onDelete={() => dispatch({ type: 'remove', id: t.id })}
        />
      ))}
    </ul>
  )
}
const FILTER_LABELS: Record<Filter, string> = {
    all: 'All',
    todo: 'To do',
    'in-progress': 'In progress',
    done: 'Done',
}

type FilterBarProps = {
    activeFilter: Filter
    counts: Record<Filter, number>
    dispatch: Dispatch<Action>
}

function FilterBar({
    activeFilter,
    counts,
    dispatch,
}: FilterBarProps) {
    return (
        <div role="group" aria-label="Task filters">
            {FILTERS.map((filter) => (
                <button
                    key={filter}
                    type="button"
                    aria-pressed={activeFilter === filter}
                    onClick={() => dispatch({ type: 'setFilter', filter })}
                    style={{
                        margin: 4,
                        backgroundColor:
                            activeFilter === filter ? '#2563eb' : '#eeeeee',
                        color: activeFilter === filter ? '#ffffff' : '#111111',
                    }}
                >
                    {FILTER_LABELS[filter]} ({counts[filter]})
                </button>
            ))}
        </div>
    )
}
export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const visibleTasks = filterTasks(state.tasks, state.filter)
  const counts = countByFilter(state.tasks)

  return (
    <main>
      <h1>Task Manager</h1>

      <AddForm dispatch={dispatch} />

      <FilterBar
        activeFilter={state.filter}
        counts={counts}
        dispatch={dispatch}
      />

      <button
        type="button"
        onClick={() => dispatch({ type: 'clearDone' })}
        disabled={counts.done === 0}
      >
        Clear done
      </button>
        <button
  type="button"
  disabled={state.past.length === 0}
  onClick={() => dispatch({ type: 'undo' })}
>
  Undo
       </button>
      <TaskList tasks={visibleTasks} dispatch={dispatch} />
    </main>
  )
}
