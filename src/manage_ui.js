function generate_UUID() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}

async function resetTaskText(list_index, id) {
	var data = await getTaskData(list_index);
	$("#"+id+".taskInput").text(data[id]);
}

function queryAccountInfo() {
	$(".totalDiv").prepend(
		"<div class=\"appDiv\">\
	        <input type=\"text\" onfocus=\"this.value=\'\'\" value=\"E-mail address\" id=\"email\" class=\"inputBar registerBar\"></br>\
	        <input type=\"text\" onfocus=\"this.value=\'\'\" value=\"Phone number\" id=\"phone\" class=\"inputBar registerBar\"></br>\
	        <input type=\"text\" onfocus=\"this.value=\'\'\" value=\"Favorite cheese\" id=\"cheese\" class=\"inputBar registerBar\"></br>\
	        <button class=\"userRegistered\">Register</button>\
		</div>");
}

async function initButtons() {
	$("body").find(".totalDiv").append("<div class=\"addListDiv\">\
											<button class=\"addList\">Add List</button>\
											<button class=\"viewAccount\">Account</button>\
										</div>");
	var data = await getUserRegisterData();
	$("body").find(".totalDiv").append("<div style=\"display: none\" id=\"accountAppDiv\" class=\"appDiv\">\
											<ul>\
												<li id=\"user_info\"><i class=\"far fa-user\"></i>	"+username+"</li>\
												<li id=\"email_info\"><i class=\"far fa-envelope\"></i>	"+data["email"]+"</li>\
												<li id=\"phone_info\"><i class=\"fas fa-phone\"></i>	"+data["phone"]+"</li>\
												<li id=\"cheese_info\"><i class=\"fas fa-cheese\"></i>	"+data["cheese"]+"</li>\
											</ul>\
										</div>");

}

function updateCompletedUI(taskId, done, list_index) {
	if (done) {
		$("body").find("#"+list_index+".todoList > #"+taskId+" > #"+taskId+".taskInput").css("text-decoration", "line-through");
		$("body").find("#"+list_index+".todoList > #"+taskId+" > #"+taskId+".completeButton").text('✓');
	} else {
		$("body").find("#"+list_index+".todoList > #"+taskId+" > #"+taskId+".taskInput").css("text-decoration", "");
		$("body").find("#"+list_index+".todoList > #"+taskId+" > #"+taskId+".completeButton").text('?');
	}
}

function removeTaskUI(id, list_index) {
	$("body").find("ul#"+list_index+".todoList > li#"+id).remove();
}

function addTaskUI(task, done, list_index, id) {
	var done_char = "?";
	if (done) {done_char = "✓";}
	$("#"+list_index+".todoList").append("\
		<li id=\""+id+"\">\
			<input id=\""+id+"\" class=\"taskInput\" type=\"text\" value=\""+task+"\"> \
			<button id=\""+id+"\" class=\"removeButton\">X</button> \
			<button id=\""+id+"\" class=\"completeButton\">"+done_char+"</button>\
		</li>");
	updateCompletedUI(id, done, list_index);
}

function removeListUI(id) {
	$("body").find("#"+id+".appDiv").remove();
}

function addListUI(id) {
	$(".totalDiv").prepend("<div id=\""+id+"\" class=\"appDiv\">\
						    	<input type=\"text\" id=\""+id+"\" class=\"taskText inputBar\">\
						  		<button id=\""+id+"\" class=\"addButton\">Add Task</button>\
						  		<button id=\""+id+"\" class=\"deleteList\">X</button>\
						    	<ul id=\""+id+"\" class=\"todoList\"></ul>\
					    	</div>");
}

async function populateUIFromDatabase(numLists) {
	for (var list_index = 0; list_index < numLists; list_index++) {
		var i = 0;
		addListUI(list_index);
		var tasks = await getTaskData(list_index);

		tasks.forEach(function(entry) {
	    	addTaskUI(entry["task"], entry["completed"], list_index, i);
	    	++i;
		});
	}
	initButtons();
}

async function initNewUser() {
	initButtons();
	addList(0);
	addListUI(0);
	setTaskData(0, [{task: "Welcome "+username, completed: false}]);
	addTaskUI("Welcome "+username, false, 0, 0);
}