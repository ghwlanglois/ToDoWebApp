$(document).on("click", ".viewAccount", async function(){
	var displayed = $("#accountAppDiv").css("display");
	if (displayed == "none") {
		$("#accountAppDiv").css("display", "block");
	} else {
		$("#accountAppDiv").css("display", "none");
	}
});

$(document).on("click", ".addList", async function(){
	var numLists = await countLists();
	var lists = await getListData();
	if (lists[numLists-1] != EMPTY_STRING) {
		addListUI(numLists);
		addList(numLists);
	} else {
		alert("You cannot have more than one empty task list at a time.");
	}
});

$(document).on("click", ".removeButton", function(){
	var id = this.id,
		list_index = this.parentNode.parentNode.id;
	removeTaskUI(id, list_index);
	removeTask(id, list_index);
});

$(document).on("click", ".completeButton", function(){
	var id = this.id,
		list_index = this.parentNode.parentNode.id;
	var done = $("#"+list_index+".todoList > #"+this.id+" > #"+this.id+".completeButton").text() == "?";
	updateCompletedUI(id, done, list_index);
	updateCompleted(id, done, list_index);
});

$(document).on("click", ".addButton", async function(){
	var list_index = this.id,
		task = $("#"+this.id+".taskText").val(),
		done = false;
	if (task) {
		if (task.length > 22) {
			alert("Task description must be shorter than 23 characters.");
		} else {
			addTask(task, done, list_index);
			var id = await countTasks(list_index);
			addTaskUI(task, done, list_index, id);
		}
	}
});

$(document).on("click", ".deleteList", function(){
	if ($("#"+this.id+".todoList").length > 0) {
		if (confirm('Delete this Todo List?')) {
			removeList(this.id);
		}
	} else {
		removeList(this.id);
	}
	removeListUI(this.id);
});

$(document).on("change", ".taskInput", async function() {
	var text = $("#"+this.id+".taskInput").val(),
		list_index = this.parentNode.parentNode.id;
	if (text != "") {
		if (text.length <= 22) {
			var data = await getTaskData(list_index);
			data[this.id] = text;
			setTaskData(list_index, data);
		} else {
			alert("Task description must be shorter than 23 characters.");
			resetTaskText(list_index, this.id);
		}
	} else {
		alert("Cannot create an empty task.");
		resetTaskText(list_index, this.id);
	}
});

$(document).on("click", ".userLogin", function(){
	username = $(".userText").val();

	if (username == "") {
		alert("Please enter a username");
	} else if (username.match(/^[a-zA-Z0-9]+/)) {
		if (username.length > 22) {
			alert("Username must be shorter than 23 characters.");
		} else {
			$(".appDiv").remove();
			processLogin();
		}
	} else {
		alert("Username can only contain numbers and letters!");
	}
});

$(document).on("click", ".userRegistered", function(){
	var email 	= $("#email").val();
	var phone 	= $("#phone").val();
	var cheese 	= $("#cheese").val();
	if (!email || !phone || !cheese) {
		alert("Please input your email, phone number, and favorite cheese.");
	} else {
		setUserRegisterData(email, phone, cheese);
		$(".appDiv").remove();
		initNewUser();
	}
});