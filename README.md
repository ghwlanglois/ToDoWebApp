# ToDoWebApp
This WebApp uses firebase and jQuery to prompt the user for an unprotected login, which leads them to a ToDo-List style application.

Users can create an unlimited number of lists which can be deleted, each with a limitless number of tasks which can be edited and deleted individually, as well as being marked as complete.

Users can also view their account information, which they entered upon logging in as a new user.

![Screenshot](https://i.ibb.co/sKHXjT6/screenshot.png)

The database is structured as follows using UIDs:

	username
		|__ lists
		|	|__list UID
		|		|__task UID
		|			|__task name
		|			|__is completed
		|__ userinfo
			|__email address
			|__phone number
			|__favorite cheese

Example:

![Database](https://i.ibb.co/JHJSmMW/68747470733a2f2f692e6962622e636f2f7a737452745a6a2f64617461626173652e706e67.png)

Jest is used for unit testing

todo.test.js is in "resources/static/js" as jest requires the unit test file to be in the same directory as the file that it requires.

Installation: npm install --save-dev jest

Run Test: npm run test