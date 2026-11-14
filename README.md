Mehmet Mert Seyhan
23000007247
# Assignment 3 — Task Manager

A task management application built with React and TypeScript.

## Installation

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm test
```

## Features

- Add and delete tasks.
- Cycle task status: To do → In progress → Done → To do.
- Filter tasks by status.
- Display live counts for all four filters.
- Clear completed tasks.
- Show an empty-list message.
- Undo changes to tasks.

## Screenshots

- screenshots/all.png
- screenshots/todo.png
- screenshots/in-progress.png
- screenshots/done.png

## Bonus 1: Undo

The state contains tasks, filter, and past. The past field stores
previous task lists before task-changing actions. Undo restores the
last saved list while keeping the current filter, and the button
is disabled when the history is empty.

## Bonus 2: Tests

Automated tests use Vitest and run with npm test.

The tests cover every reducer action, the three-step status cycle,
immutability, undo, filtering, and counts. Edge cases include unknown
IDs, empty lists, clearing when nothing is done, and counts after
deleting a task.

Test output:


Test Files  2 passed (2)
      Tests  22 passed (22)
   Start at  12:49:41
   Duration  137ms (import 42%, transform 24%, tests 17%, worker 16%, environment 1%)

## Bonus 3: Explain your reducer

A reducer must be pure because React expects state updates to be
predictable. Given the same state and action, it should calculate
the same next state without changing anything outside the function.
Mutating the previous state can change data that earlier renders
still reference. If the same state object is returned, React may
also skip an update because its reference has not changed. My reducer
uses spread syntax, map, and filter to create updated values.

The caller creates each task ID with crypto.randomUUID() and sends
it in the add action. Generating an ID inside the reducer would make
the result depend on a random value. Calling it twice with the same
inputs could then produce different tasks.

The visible list and counts are calculated from the current tasks
during rendering. They are not separate state fields because they
represent information already available in state. Storing them
separately would require updating several values after every action.
For example, deleting a task could remove it from the main list while
leaving an outdated count on a filter button.

Moving the filter into reducer state made the update rules easier
to find in one place. Components dispatch actions rather than
managing separate task and filter setters. However, changing the
state shape required updating the existing reducer cases and the
props passed to the task list. Adding undo also required deciding
which actions belong in history: task changes are saved, while
filter changes are not.

## Bonus 4: Git repository

Repository (https://github.com/mertsyh/task-manager-assignment3)

The repository includes the source code, automated tests, and four
screenshots. node_modules and dist are excluded through .gitignore.