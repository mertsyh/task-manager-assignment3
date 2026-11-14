import { describe, expect, it } from 'vitest'
import { initialState, taskReducer } from './taskReducer'
import type { State } from './taskReducer'

function createState(): State {
  return {
    tasks: [
      { id: '1', title: 'Study React', status: 'todo' },
      { id: '2', title: 'Write tests', status: 'in-progress' },
      { id: '3', title: 'Read notes', status: 'done' },
    ],
    filter: 'all',
    past: [],
  }
}

describe('taskReducer', () => {
  it('adds a task with todo status', () => {
    const result = taskReducer(initialState, {
      type: 'add',
      id: '1',
      title: 'Study React',
    })

    expect(result.tasks).toEqual([
      { id: '1', title: 'Study React', status: 'todo' },
    ])
    expect(result.past).toEqual([[]])
  })

  it('cycles a task back to todo after three advances', () => {
    let state = createState()

    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0]?.status).toBe('in-progress')

    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0]?.status).toBe('done')

    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0]?.status).toBe('todo')
  })

  it('removes the selected task', () => {
    const result = taskReducer(createState(), {
      type: 'remove',
      id: '2',
    })

    expect(result.tasks.map((task) => task.id)).toEqual(['1', '3'])
  })

  it('changes the filter without adding undo history', () => {
    const state = createState()
    const result = taskReducer(state, {
      type: 'setFilter',
      filter: 'done',
    })

    expect(result.filter).toBe('done')
    expect(result.tasks).toEqual(state.tasks)
    expect(result.past).toEqual([])
  })

  it('clears completed tasks and preserves the filter', () => {
    const state = createState()
    state.filter = 'done'

    const result = taskReducer(state, { type: 'clearDone' })

    expect(result.tasks.map((task) => task.id)).toEqual(['1', '2'])
    expect(result.filter).toBe('done')
  })

  it('undoes clearDone and preserves the current filter', () => {
    const original = createState()
    const cleared = taskReducer(original, { type: 'clearDone' })
    const filtered = taskReducer(cleared, {
      type: 'setFilter',
      filter: 'done',
    })
    const restored = taskReducer(filtered, { type: 'undo' })

    expect(restored.tasks).toEqual(original.tasks)
    expect(restored.filter).toBe('done')
    expect(restored.past).toEqual([])
  })

  it('does nothing when undo history is empty', () => {
    const result = taskReducer(initialState, { type: 'undo' })

    expect(result).toBe(initialState)
  })

  it('does not mutate the previous state', () => {
    const state = createState()
    const snapshot = structuredClone(state)

    for (const task of state.tasks) {
      Object.freeze(task)
    }

    Object.freeze(state.tasks)
    Object.freeze(state.past)
    Object.freeze(state)

    const result = taskReducer(state, {
      type: 'advance',
      id: '1',
    })

    expect(state).toEqual(snapshot)
    expect(result).not.toBe(state)
    expect(result.tasks).not.toBe(state.tasks)
    expect(result.tasks[0]).not.toBe(state.tasks[0])
    expect(result.tasks[0]?.status).toBe('in-progress')
  })

  it('preserves tasks when an unknown id is advanced or removed', () => {
    const state = createState()

    const advanced = taskReducer(state, {
      type: 'advance',
      id: 'missing',
    })
    const removed = taskReducer(state, {
      type: 'remove',
      id: 'missing',
    })

    expect(advanced.tasks).toEqual(state.tasks)
    expect(removed.tasks).toEqual(state.tasks)
  })

  it('handles clearDone on an empty list', () => {
    const result = taskReducer(initialState, { type: 'clearDone' })

    expect(result.tasks).toEqual([])
    expect(result.filter).toBe('all')
  })

  it('preserves tasks when nothing is done', () => {
    const state: State = {
      tasks: [{ id: '1', title: 'Study React', status: 'todo' }],
      filter: 'todo',
      past: [],
    }

    const result = taskReducer(state, { type: 'clearDone' })

    expect(result.tasks).toEqual(state.tasks)
    expect(result.filter).toBe('todo')
  })
})