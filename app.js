let {PythonShell} = require('python-shell')


const express = require("express"); 
const bodyParser = require("body-parser"); 
const fs = require('fs')
const file = 'userdata.json'
// configuration for json file with user input
const jsonfile = require('jsonfile');   

var app = express();
var isTime = false;
let cachedUser = {};

app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: true
})); 
 

// what happens when the web page is opened
app.get('/',function(req,res){ 
res.set({ 
	'Access-control-Allow-Origin': '*'
	}); 
return res.redirect('index.html');
})


// after the user signed in, save data
app.post('/sign_up', function(req,res){ 
	if (!isTime){
		var name = req.body.name; 
		var email =req.body.email; 
	
		var data = { 
			"name": name, 
			"email":email
		} 

		cachedUser["sign_up"] = data;

		return res.redirect('/questions.html'); 
	}

});

app.get("/sign_up", function (req, res) {
    res.send(JSON.stringify(cachedUser["sign_up"]));
});


// after the user answered questions, save answers
app.post('/details', function(req,res){ 
	if (!isTime){
		var name = req.body.name; 
		var degree_1 = req.body.degree_1; 
		var degree_2 = (req.body.degree_2 == "") ? null :  req.body.degree_2;
		var year = req.body.year;
		var courses = (req.body.courses == "") ? [] : req.body.courses;
		var hobbies = (req.body.hobbies == "") ? [] : req.body.hobbies;
		var any = req.body.any;
		var id = makeid();

		fields = [degree_1, degree_2]
	
		// create student object
		var data = { 
			"id": id,
			"given-name": name, 
			"studies": {"fields":fields, "year":year},
			"courses":courses,
			"hobbies":hobbies,
			"extra-info": any
		} 

		cachedUser["details"] = data;

		// add to JSON file 
		jsonfile.writeFileSync(file, data, {flag: 'a'});
		
		//call to python function
		InitUsersPython();
		getMeetingsPython();

		// wait for the json file from getMeetingsPython to be created
		// then use the file to create meetings
		const checkTime = 1000;
		function check() {
			setTimeout(() => {
				fs.readFile('groups.json', 'utf8', function(err, data) {
					if (err) {
						// got error reading the file, call check() again
						check();
					} else {
						// we have the file contents here, so do something with it
						var meetingsData = JSON.parse(fs.readFileSync('groups.json', 'utf-8'));
						//console.log(meetingsData);
					}
				});
			}, checkTime)
		}

		check();

		// var meetingsData = jsonfile.readFileSync('groups.json', 'utf-8');
		//console.log(meetingsData);

		//var meetingsData = JSON.parse(fs.readFileSync('groups.json', 'utf-8'));
		
		// console.log(res);
		//recieve url of the meeting
		//send user to meeting

		res.redirect('/meeting.html');
		return res.end('bye!');
	}
});

app.get("/details", function (req, res) {
    res.send(JSON.stringify(cachedUser["details"]));
});

// the app will listen to port 3000
app.listen(3000, err => {
	if (err) {
	  console.log("there was a problem", err);
	  return;
	}
	console.log("listening on port 3000");
  });


/**************************************************************HELP FUNCTIONS***********************************************************/


//create random ID per user, each ID is 12 characters
function makeid() {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	// add 12 characters - letters or digits
	for ( var i = 0; i < 12; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


function createMeetings(){
	// first time - before first meeting of the session call init
	if (isTime){
		InitUsersPython();
		isTime = false;
	}
	var counter = 1;
	// call the getMeetingsPython before each meeting
	var timerID = setInterval(function() {
		var meetings = getMeetingsPython();
		//do something with meetings - ariel
		counter += 1;
		if (counter > 3){
			clearInterval(timerID);
		}
	}, 60 * 1000 * 20); //call the function every 20 minutes	
}


/**************************************************************PYTHON******************************************************************/


function InitUsersPython(){
	let options = {
		mode: 'json',
		pythonPath: 'python',
		// pythonOptions: ['-u'], // get print results in real-time
		scriptPath: '.',
		args: ['init', 'userdata.json']
	  };
	   
	PythonShell.run('script.py', options, function (err) {
		if (err) throw err;
	});
}


function getMeetingsPython(){
	let options = {
		mode: 'json',
		pythonPath: 'python',
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: '.',
		args: ['get_groups']
	  };
	   
	PythonShell.run('script.py', options, function (err, results) {
		if (err) throw err;
	});
}
