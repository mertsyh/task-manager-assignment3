// Mehmet Mert Seyhan
// 23000007247

import type { Filter } from './filter'

export type Status = 'todo' | 'in-progress' | 'done'

export type Task = {
    id: string
    title: string
    status: Status
}

export type State = {
  tasks: Task[]
  filter: Filter
  past: Task[][]
}

export const initialState: State = {
  tasks: [],
  filter: 'all',
  past: [],
}

export type Action =
    | { type: 'add'; id: string; title: string }
    | { type: 'advance'; id: string }
    | { type: 'remove'; id: string }
    | { type: 'setFilter'; filter: Filter }
    | { type: 'clearDone' }
    | { type: 'undo' }

const NEXT: Record<Status, Status> = {
    todo: 'in-progress',
    'in-progress': 'done',
    done: 'todo',
}

export function taskReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'add':
            return {
                ...state,
                past: [...state.past, state.tasks],
                tasks: [
                    ...state.tasks,
                    {
                        id: action.id,
                        title: action.title,
                        status: 'todo',
                    },
                ],
            }

        case 'advance':
            return {
                ...state,
                past: [...state.past, state.tasks],
                tasks: state.tasks.map((task) =>
                    task.id === action.id
                        ? { ...task, status: NEXT[task.status] }
                        : task,
                ),
            }

        case 'remove':
            return {
                ...state,
                past: [...state.past, state.tasks],
                tasks: state.tasks.filter((task) => task.id !== action.id),
            }

        case 'setFilter':
            return {
                ...state,
                filter: action.filter,
            }

        case 'clearDone':
      return {
        ...state,
        past: [...state.past, state.tasks],
        tasks: state.tasks.filter((task) => task.status !== 'done'),
      }

    case 'undo': {
      const previousTasks = state.past[state.past.length - 1]

      if (previousTasks === undefined) {
        return state
      }

      return {
        ...state,
        tasks: previousTasks,
        past: state.past.slice(0, -1),
      }
    } 
  } 

  const unhandledAction: never = action
  return unhandledAction
} // taskReducer fonksiyonunun sonu