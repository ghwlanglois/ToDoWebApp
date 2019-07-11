var tasks = [];
var completed = [];
var userId = "";
var identifier = 0;
var u = 0;

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyAl-L2XVEE0di9JR9w4jgXJn0slPDyxA3k",
	authDomain: "gabestodowebapp.firebaseapp.com",
	databaseURL: "https://gabestodowebapp.firebaseio.com",
	projectId: "gabestodowebapp",
	storageBucket: "",
	messagingSenderId: "259899508992",
	appId: "1:259899508992:web:f4583e409fd329fb"
};

// Initialize Firebase with a "default" Firebase project
var defaultProject = firebase.initializeApp(firebaseConfig);
var database = firebase.database();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateSave() {
	sleep(300).then(() => {
		for (var i = 0; i < tasks.length; i++) {
			database.ref(userId+"/"+i).set({
				tasks: tasks[i],
				completed: completed[i]
			});
		}

		var f = tasks.length;
		var breakLoop = false;
		while(!breakLoop) {
			database.ref(userId+"/"+f).on('value', function(snapshot) {
				if (snapshot.val() == null) {
					breakLoop = true;
					return;
				} else {
					database.ref(userId+"/"+f).set({});
					++f;
				}
			});
		}
	});
}

function updateCompleted(taskId, done, list_index) {
	var index = tasks[list_index].indexOf($("#"+taskId+".taskInput").val());
	if (done) {
		$("#"+taskId+".taskInput").css("text-decoration", "line-through");
		$("#"+taskId+".completeButton").text('✓');
		completed[list_index][index] = true;
	} else {
		$("#"+taskId+".taskInput").css("text-decoration", "");
		$("#"+taskId+".completeButton").text('?');
		completed[list_index][index] = false;
	}
}

function addTask(task, done, list_index) {
	if (task != "") {
		if (task.length > 22) {
			alert("Task description must be shorter than 23 characters.");
		} else {
			$("#"+list_index+".todoList").append("\
				<li id=\""+identifier+"\">\
					<input id=\""+identifier+"\" class=\"taskInput\" type=\"text\" value=\""+task+"\"> \
					<button id=\""+identifier+"\" class=\"removeButton\">X</button> \
					<button id=\""+identifier+"\" class=\"completeButton\">✓</button>\
				</li>");
			tasks[list_index].push(task);
			completed[list_index].push(done);
			updateCompleted(identifier, done, list_index);
			++identifier;
		}
	}
}

function removeList(id) {
	tasks.splice(id, 1);
	completed.splice(id, 1);
	$("#"+id+".appDiv").remove();
}

function addList(id) {
	$("body").prepend( "<div id=\""+id+"\" class=\"appDiv\">\
					    	<input type=\"text\" id=\""+id+"\" class=\"taskText inputBar\">\
					  		<button id=\""+id+"\" class=\"addButton\">Add Task</button>\
					  		<button id=\""+id+"\" class=\"deleteList\">X</button>\
					    	<ul id=\""+id+"\" class=\"todoList\"></ul>\
					    </div>");
	tasks.push([]);
	completed.push([]);
}

$(document).on("click", ".addList", function(){
	addList(tasks.length);
});

$(document).on("click", ".removeButton", function(){
	var list_index = this.parentNode.parentNode.id;
	var index = tasks[list_index].indexOf($("#"+this.id+".taskInput").val());
	tasks[list_index].splice(index, 1);
	completed[list_index].splice(index, 1);
	$("#"+this.id).remove();
	updateSave();
});

$(document).on("click", ".completeButton", function(){
	updateCompleted(this.id, $("#"+this.id+".completeButton").text() == "?", this.parentNode.parentNode.id);
	updateSave();
});

$(document).on("click", ".addButton", function(){
	addTask($("#"+this.id+".taskText").val(), false, this.id);
	updateSave();
});

$(document).on("click", ".deleteList", function(){
	if ($("#"+this.id+".todoList").length > 0) {
		if (confirm('Delete this Todo List?')) {
			removeList(this.id);
		}
	} else {
		removeList(this.id);
	}
	updateSave();
});

$(document).on("change", ".taskInput", function() {
	var text = $("#"+this.id+".taskInput").val();
	if (text != "") {
		if (userId.length <= 22) {
			var list_index = this.parentNode.parentNode.id;
			tasks[list_index][this.id] = text;
		} else {
			alert("Task description must be shorter than 23 characters.");
		$("#"+this.id+".taskInput").text(tasks[list_index][this.id]);
		}
	} else {
		alert("Cannot create an empty task.");
		$("#"+this.id+".taskInput").text(tasks[list_index][this.id]);
	}
	updateSave();
});

$(document).on("click", ".userLogin", function(){
	userId = $(".userText").val();

	if (userId == "") {
		alert("Please enter a username");
	} else if (userId.match(/^[a-zA-Z0-9]+/)) {
		if (userId.length > 22) {
			alert("Username must be shorter than 23 characters.");
		} else {
			$("body").append("<div class=\"addListDiv\"><button class=\"addList\">Add List</button></div>");
			$(".userText").remove();
			$(".userLogin").remove();
			$(".appDiv").remove();

			u = 0;
			var forceBreak = false;
			database.ref(userId).on('value', function(snapshot) {
				if (snapshot.val() == null) {
					addList(0);
					addTask("Welcome "+userId, false, 0);
					return;
				} else {
					while(!forceBreak) {
						database.ref(userId+"/"+u).on('value', function(snapshot) {
							if (snapshot.val() == null) {
								forceBreak = true;
								return;
							} else {
								++u;
							}
						});
					}
				}
			});
			
			sleep(100).then(() => {
				console.log(u);
				for (var j = 0; j < u; j++) {
					addList(j);
					var tempCompleted = [];
					var tasksRef = database.ref(userId + '/' + j + '/tasks');
					var completedRef = database.ref(userId + '/' + j + '/completed');

					completedRef.on('value', function(snapshot) {
						tempCompleted = snapshot.val();
					});

					var i = 0;
					tasksRef.on('value', function(snapshot) {
						snapshot.val().forEach(function(entry) {
						    addTask(entry, tempCompleted[i], j);
						    ++i;
						});
					});
				}
			});
		}
	} else {
		alert("Username can only contain numbers and letters!");
	}
});