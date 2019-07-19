$(document).ready(function () {
	$("body").on("click", ".viewAccount", function(){
		var displayed = $("#accountAppDiv").css("display");
		if (displayed == "none") {
			$("#accountAppDiv").css("display", "block");
		} else {
			$("#accountAppDiv").css("display", "none");
		}
	});

	$("body").on("click", "#logout", function(){
		location.reload();
	});

	$("body").on("click", ".addList", function(){
		var uuid = generate_UUID();
		addListUI(uuid);
		addList(uuid);
	});

	$("body").on("click", ".removeButton", function(){
		var id = this.parentNode.id,
			list_index = this.parentNode.parentNode.parentNode.id;
		removeTaskUI(id, list_index);
		removeTask(id, list_index);
	});

	$("body").on("click", ".completeButton", function(){
		var id = this.parentNode.id,
			list_index = this.parentNode.parentNode.parentNode.id,
			done = $("#"+this.id+".completeButton").text() == "?";
		updateCompletedUI(id, done, list_index);
		updateCompleted(id, done, list_index);
	});

	$("body").on("click", ".addButton", function(){
		var list_index = this.parentNode.id,
			task = $("#taskinput"+this.id.replace("addtaskbutton","")+".taskText").val(),
			done = false;
		if (task) {
			if (task.length > 22) {
				alert("Task description must be shorter than 23 characters.");
			} else {
				var uuid = generate_UUID();
				addTask(task, done, list_index, uuid);
				addTaskUI(task, done, list_index, uuid);
			}
		}
	});

	$("body").on("click", ".deleteList", function(){
		var id = this.parentNode.id;
		if ($("#listcontainer"+id+".todoList").length > 0) {
			if (confirm('Delete this Todo List?')) {
				removeList(id);
			}
		} else {
			removeList(id);
		}
		removeListUI(id);
	});

	$("body").on("change", ".taskInput", async function() {
		var text = $("#"+this.id+".taskInput").val(),
			id = this.id.replace("input", "");
			list_index = this.parentNode.parentNode.parentNode.id;
		if (text != "") {
			if (text.length <= 22) {
				var data = await getSingleTask(list_index, id);
				data["task"] = text;
				database.ref(username+"/lists/"+list_index+"/"+id).set(data);
			} else {
				alert("Task description must be shorter than 23 characters.");
				resetTaskText(list_index, id);
			}
		} else {
			alert("Cannot create an empty task.");
			resetTaskText(list_index, id);
		}
	});

	$("body").on("click", ".userLogin", function(){
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

	$("body").on("click", ".userRegistered", function(){
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
});