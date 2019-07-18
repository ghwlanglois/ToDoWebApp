async function updateCompleted(taskId, done, list_index) {
	var completed_data = await getTaskData(list_index);
	completed_data[taskId]["completed"] = done;
	setTaskData(list_index, completed_data);
}

async function removeTask(id, list_index) {
	var task_data = await getTaskData(list_index);
	task_data.splice(id, 1);
	setTaskData(list_index, task_data);
}

async function addTask(task, done, list_index) {
	var task_data = await getTaskData(list_index);
	if (task_data == EMPTY_STRING)
		task_data = [];
	task_data.push({task: task, completed: done});
	setTaskData(list_index, task_data);
}

function removeList(list_index) {
	removeListFromDB(list_index);
}

function addList(list_index) {
	addListToDB(list_index);
}

async function countLists() {
	var lists = await getListData();
	return lists.length;
}

async function countTasks(list_index) {
	var tasks = await getTaskData(list_index);
	return tasks.length;
}

async function processLogin() {
	var newUser = await isNewUser();
	if (!newUser) {
		var numLists = await countLists();
		populateUIFromDatabase(numLists);
	} else {
		queryAccountInfo();
	}
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = countLists;
    module.exports = countTasks;
    module.exports = addList;
    module.exports = addTask;
    module.exports = removeList;
    module.exports = removeTask;
    module.exports = updateCompleted;
} else {
	window.countLists = countLists;
	window.countTasks = countTasks;
	window.addList = addList;
	window.addTask = addTask;
	window.removeList = removeList;
	window.removeTask = removeTask;
	window.updateCompleted = updateCompleted;
}