const express = require("express"); 
const bodyParser = require("body-parser"); 

var app = express();


app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: true
})); 

// configuration for json file with user input
var jsonfile = require('jsonfile');    
var file = './userdata.json'

// what happens when the web page is opened
app.get('/',function(req,res){ 
res.set({ 
	'Access-control-Allow-Origin': '*'
	}); 
return res.redirect('index.html');
})

// after the user signed in, save data
app.post('/sign_up', function(req,res){ 
	var name = req.body.name; 
	var email =req.body.email; 

	var data = { 
		"name": name, 
		"email":email
	} 

	return res.redirect('/questions.html'); 
}) ;

// after the user answered questions, save answers
app.post('/details', function(req,res){ 
	var name = req.body.name; 
	var degree_1 = req.body.degree_1; 
	var degree_2 = (req.body.degree_2 == "") ? null :  req.body.degree_2;
	var year = req.body.year;
	var courses = req.body.courses;
	var hobbies = req.body.hobbies;
	var any = req.body.any;

	// create student object
	var data = { 
		"name": name, 
		"degree_1":degree_1,
		"degree_2":degree_2,
		"year":year,
		"courses":courses,
		"hobbies":hobbies,
		"any": any
	} 
	// add to JSON file 
	jsonfile.writeFileSync(file, data, {flag: 'a'});
	return res.end();

});

// the app will listen to port 3000
app.listen(3000, err => {
	if (err) {
	  console.log("there was a problem", err);
	  return;
	}
	console.log("listening on port 3000");
  });

