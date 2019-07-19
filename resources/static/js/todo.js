async function updateCompleted(taskId, done, list_index) {
	var data = await getSingleTask(list_index, taskId);
	data["completed"] = done;
	database.ref(username+"/lists/"+list_index+"/"+taskId).set(data);
}

function removeTask(id, list_index) {
	database.ref(username+"/lists/"+list_index+"/"+id).remove();
}

function addTask(task, done, list_index, taskId) {
	database.ref(username+"/lists/"+list_index+"/"+taskId).set({task: task, completed: done});
}

function removeList(list_index) {
	database.ref(username+"/lists/"+list_index).remove();
}

async function addList(list_index) {
	database.ref(username+"/lists/"+list_index+"/"+generate_UUID()).set({});
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
		populateUIFromDatabase();
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