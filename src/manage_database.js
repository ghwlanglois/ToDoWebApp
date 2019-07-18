async function getTaskData(list_index) {
	return await getTodoData("/lists/"+list_index);
}

async function getListData() {
	return await getTodoData("/lists");
}

async function getTodoData(suffix) {
	var data, err;
	await database.ref(username+suffix).once('value').then(
		function(snapshot) 	{data = snapshot.val();},
		function(error) 	{err = error;}
		
	);

	if (err) {
		alert("Error: "+err);
		console.log("Error: "+err);
		return err;
	} else if (data) {
		if (data == EMPTY_STRING)
			return [];
		return data;
	} else {
		return [];
	}
}

function setTaskData(list_index, data) {
	database.ref(username+"/lists/"+list_index).set(data);
}

function setListData(data) {
	database.ref(username+"/lists").set(data);
}

async function removeListFromDB(list_index) {
	var lists = await getListData();
	lists.splice(list_index, 1);
	setListData(lists);
}

function addListToDB(list_index) {
	database.ref(username+"/lists/"+list_index).set(EMPTY_STRING);
}

async function isNewUser() {
	var newUser = false;
	await database.ref(username+"/userinfo").once('value').then(function(snapshot) {
		if (!snapshot.val()) {
			newUser = true;
		}
	});
	return newUser;
}

function setUserRegisterData(email, phone, cheese) {
	database.ref(username+"/userinfo").set({
		email: email,
		phone: phone,
		cheese: cheese
	});
}

async function getUserRegisterData() {
	var data;
	await database.ref(username+"/userinfo").once('value').then(function(snapshot){
		data = snapshot.val();
	});
	return data;
}