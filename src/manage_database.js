async function getSingleTask(list_index, taskId) {
	var data;
	await database.ref(username+"/lists/"+list_index+"/"+taskId).once('value').then(function(snapshot) {
		data = snapshot.val();
	});
	return data;
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