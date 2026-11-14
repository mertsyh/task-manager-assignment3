import { describe, expect, it } from 'vitest'
import { filterTasks, countByFilter } from './filter'
import { taskReducer } from './taskReducer'
import type { State, Task } from './taskReducer'

function createTasks(): Task[] {
  return [
    { id: '1', title: 'Study React', status: 'todo' },
    { id: '2', title: 'Write tests', status: 'in-progress' },
    { id: '3', title: 'Read notes', status: 'done' },
    { id: '4', title: 'Prepare screenshots', status: 'todo' },
  ]
}

describe('filterTasks', () => {
  it('returns every task for all', () => {
    const tasks = createTasks()

    expect(filterTasks(tasks, 'all')).toEqual(tasks)
  })

  it('returns only todo tasks', () => {
    const result = filterTasks(createTasks(), 'todo')

    expect(result.map((task) => task.id)).toEqual(['1', '4'])
  })

  it('returns only in-progress tasks', () => {
    const result = filterTasks(createTasks(), 'in-progress')

    expect(result.map((task) => task.id)).toEqual(['2'])
  })

  it('returns only done tasks', () => {
    const result = filterTasks(createTasks(), 'done')

    expect(result.map((task) => task.id)).toEqual(['3'])
  })

  it('handles an empty task list', () => {
    expect(filterTasks([], 'all')).toEqual([])
    expect(filterTasks([], 'todo')).toEqual([])
    expect(filterTasks([], 'in-progress')).toEqual([])
    expect(filterTasks([], 'done')).toEqual([])
  })

  it('returns an empty list when no tasks match', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Study React', status: 'todo' },
    ]

    expect(filterTasks(tasks, 'done')).toEqual([])
  })

  it('does not change the original tasks', () => {
    const tasks = createTasks()
    const snapshot = structuredClone(tasks)

    filterTasks(tasks, 'done')

    expect(tasks).toEqual(snapshot)
  })
})

describe('countByFilter', () => {
  it('counts all tasks and each status', () => {
    expect(countByFilter(createTasks())).toEqual({
      all: 4,
      todo: 2,
      'in-progress': 1,
      done: 1,
    })
  })

  it('returns zero counts for an empty list', () => {
    expect(countByFilter([])).toEqual({
      all: 0,
      todo: 0,
      'in-progress': 0,
      done: 0,
    })
  })

  it('updates counts after a task is deleted', () => {
    const state: State = {
      tasks: createTasks(),
      filter: 'all',
      past: [],
    }

    const result = taskReducer(state, {
      type: 'remove',
      id: '1',
    })

    expect(countByFilter(result.tasks)).toEqual({
      all: 3,
      todo: 1,
      'in-progress': 1,
      done: 1,
    })
  })

  it('does not change the original tasks', () => {
    const tasks = createTasks()
    const snapshot = structuredClone(tasks)

    countByFilter(tasks)

    expect(tasks).toEqual(snapshot)
  })
})