const MockedToDo = require('./todo');

jest.mock('./todo', function() {
	var tasks = [];
	var invalidListMsg = "Invalid List",
		invalidTaskMsg = "Invalid Task";
	return class ToDo {
		addList(list_index) {
			return tasks.push([]);
		}
		removeList(list_index) {
			if (tasks[list_index])
				return tasks.splice(list_index, 1);
			else return invalidListMsg;
		}
		addTask(task, done, list_index) {
			if (tasks[list_index])
				return tasks[list_index].push({task: task, completed: done});
			else return invalidListMsg;
		}
		removeTask(id, list_index) {
			if (tasks[list_index]) {
				if (tasks[list_index][id])
					return tasks[list_index].splice(id, 1);
				else return invalidTaskMsg;
			} else return invalidListMsg;
		}
		updateCompleted(id, done, list_index) {
			if (tasks[list_index]) {
				if (tasks[list_index][id]) {
					tasks[list_index][id]["completed"] = done;
					return tasks[list_index];
				} else return invalidTaskMsg;
			} else return invalidListMsg;
		}
		countLists() {
			return tasks.length;
		}
		countTasks(list_index) {
			if (tasks[list_index])
				return tasks[list_index].length;
			else return invalidListMsg;
		}
	}
});

describe('ToDo', () => {
	var todo = new MockedToDo();
	describe('addList', () => {
		it('adds 3 empty lists', () => {
			todo.addList(0);
			todo.addList(1);
			todo.addList(2);
			expect(todo.countLists()).toBe(3);
		})
	})
	describe('countTasks (invalid)', () => {
		it('counts the tasks in a list that does not exist', () => {
			expect(todo.countTasks(99)).toBe("Invalid List");
		})
	})
	describe('removeList', () => {
		it('removes the last made list', () => {
			expect(todo.removeList(2)).toStrictEqual([[]]);
		})
	})
	describe('removeList (invalid)', () => {
		it('removes a list that no longer exists', () => {
			expect(todo.removeList(2)).toBe("Invalid List");
		})
	})
	describe('addTask', () => {
		it('adds 3 tasks to a list', () => {
			todo.addTask("Task1", false, 0);
			todo.addTask("Task2", true, 0);
			expect(todo.countTasks(0)).toBe(2);
		})
	})
	describe('addTask (invalid list)', () => {
		it('adds a task to a list that does not exist', () => {
			expect(todo.addTask("Bad Task", false, 99)).toBe("Invalid List");
		})
	})
	describe('updateCompleted', () => {
		it('updates a task to be completed', () => {
			expect(todo.updateCompleted(0, true, 0)).toStrictEqual([{task: "Task1", completed: true}, {task: "Task2", completed: true}]);
		})
	})
	describe('updateCompleted (invalid task)', () => {
		it('updates a task that does not exist to be completed', () => {
			expect(todo.updateCompleted(99, true, 0)).toBe("Invalid Task");
		})
	})
	describe('updateCompleted (invalid list)', () => {
		it('updates a task to be completed in a list that does not exist', () => {
			expect(todo.updateCompleted(0, true, 99)).toBe("Invalid List");
		})
	})
	describe('removeTask', () => {
		it('removes a task from the first list', () => {
			expect(todo.removeTask(1,0)).toStrictEqual([{task: "Task2", completed: true}]);
		})
	})
	describe('removeTask (invalid task)', () => {
		it('removes a task that does not exists from a valid list', () => {
			expect(todo.removeTask(99, 0)).toBe("Invalid Task");
		})
	})
	describe('removeTask (invalid list)', () => {
		it('removes a task that does not exists from a valid list', () => {
			expect(todo.removeTask(0, 99)).toBe("Invalid List");
		})
	})
})