var tasks = [];
var identifier = 0;

$(document).on("click", ".removeButton", function(){
	$("#"+this.id).remove();
});

$(document).ready(function(){
	$(".addButton").click(function(){
		$(".todoList").append("<li id=\""+identifier+"\"><button id=\""+identifier+"\" class=\"removeButton\">X</button>  "+$(".taskText").val()+"</li>");
		identifier += 1;
	});
});