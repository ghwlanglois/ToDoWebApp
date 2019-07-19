var username = "";

var firebaseConfig = {
	apiKey: "AIzaSyAl-L2XVEE0di9JR9w4jgXJn0slPDyxA3k",
	authDomain: "gabestodowebapp.firebaseapp.com",
	databaseURL: "https://gabestodowebapp.firebaseio.com",
	projectId: "gabestodowebapp",
	storageBucket: "",
	messagingSenderId: "259899508992",
	appId: "1:259899508992:web:f4583e409fd329fb"
};

var defaultProject = firebase.initializeApp(firebaseConfig);
var database = firebase.database();