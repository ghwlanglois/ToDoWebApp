function generate_UUID() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}

async function resetTaskText(list_index, id) {
	var data = await getSingleTask(list_index, id);
	$("#input"+id+".taskInput").val(data["task"]);
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
	$("body").find(".totalDiv").prepend("<div style=\"position: relative; bottom: 17px;\" class=\"appDiv\">\
									        <h1>Gabe's Todo Webapp</h1>\
									        <img src=\"img/jg_logo.png\" alt=\"JG Logo\">\
								        </div>");
	$("body").find(".totalDiv").append("<div class=\"addListDiv\">\
											<button class=\"addList\">Add List</button>\
											<button class=\"viewAccount\">Account</button>\
										</div>");
	var data = await getUserRegisterData();
	$("body").find(".totalDiv").append("<div style=\"display: none\" id=\"accountAppDiv\" class=\"appDiv\">\
											<ul>\
												<li id=\"user_info\"><i class=\"far fa-user\"></i>	"+username+"</li>\
												<li id=\"email_info\"><i class=\"far fa-envelope\"></i>	"+data["email"]+"</li>\
											</ul>\
											<ul id=\"second_info\">\
												<li id=\"phone_info\"><i class=\"fas fa-phone\"></i>	"+data["phone"]+"</li>\
												<li id=\"cheese_info\"><i class=\"fas fa-cheese\"></i>	"+data["cheese"]+"</li>\
											</ul>\
											<button id=\"logout\">Sign Out</button>\
										</div>");

}

function updateCompletedUI(taskId, done, list_index) {
	if (done) {
		$("body").find("#input"+taskId+".taskInput").css("text-decoration", "line-through");
		$("body").find("#complete"+taskId+".completeButton").text('✓');
	} else {
		$("body").find("#input"+taskId+".taskInput").css("text-decoration", "");
		$("body").find("#complete"+taskId+".completeButton").text('?');
	}
}

function removeTaskUI(id, list_index) {
	$("body").find("ul#listcontainer"+list_index+".todoList > li#"+id).remove();
}

function addTaskUI(task, done, list_index, id) {
	var done_char = "?";
	if (done) {done_char = "✓";}
	$("#"+list_index+" > .todoList").append("\
		<li id=\""+id+"\">\
			<input id=\"input"+id+"\" class=\"taskInput\" type=\"text\" value=\""+task+"\"> \
			<button id=\"remove"+id+"\" class=\"removeButton\">X</button> \
			<button id=\"complete"+id+"\" class=\"completeButton\">"+done_char+"</button>\
		</li>");
	updateCompletedUI(id, done, list_index);
}

function removeListUI(id) {
	$("body").find("#"+id+".appDiv").remove();
}

function addListUI(id) {
	$(".totalDiv").prepend("<div id=\""+id+"\" class=\"appDiv\">\
						    	<input type=\"text\" id=\"taskinput"+id+"\" class=\"taskText inputBar\">\
						  		<button id=\"addtaskbutton"+id+"\" class=\"addButton\">Add Task</button>\
						  		<button id=\"deletelistbutton"+id+"\" class=\"deleteList\">X</button>\
						    	<ul id=\"listcontainer"+id+"\" class=\"todoList\"></ul>\
					    	</div>");
}

async function populateUIFromDatabase() {
	await database.ref(username+"/lists").once('value').then(
		function(snapshot) 	{
			var lists = snapshot.val();
			$.each(lists, async function(list_key, list_value) {
				addListUI(list_key);
		    	$.each(list_value, function(task_key, task_value) {
			    	addTaskUI(task_value["task"], task_value["completed"], list_key, task_key);
				});
			});
		}
	);
	initButtons();
}

async function initNewUser() {
	initButtons();
	var list_uuid = generate_UUID();
	var task_uuid = generate_UUID();
	addList(list_uuid);
	addListUI(list_uuid);
	database.ref(username+"/lists/"+list_uuid+"/"+task_uuid).set({task: "Welcome "+username, completed: false});
	addTaskUI("Welcome "+username, false, list_uuid, task_uuid);
}