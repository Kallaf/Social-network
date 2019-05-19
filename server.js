var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser');
var path = require('path');
var bcrypt = require('bcrypt-nodejs')

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'social_network'
});

const app = express();

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.engine('.hbs',exphbs({
	extname: '.hbs',
	defaultLayout:'main'
}))

app.set('view engine','.hbs')


app.get('/', function(request, response) {
	if (request.session.loggedin) {
		response.render('index',{
			name: request.session.username
		});
		} else {
		response.render('register');
	}
});

// app.get('/register.html', function(request, response) {
// 	response.sendFile(path.join(__dirname+'/register.html'));
// });

app.get('/css/bootstrap.min.css', function(request, response) {
	response.sendFile(path.join(__dirname+'/css/bootstrap.min.css'));
});

app.get('/js/bootstrap.min.js', function(request, response) {
	response.sendFile(path.join(__dirname+'/js/bootstrap.min.js'));
});

app.get('/jquery-3.3.1.min.js', function(request, response) {
	response.sendFile(path.join(__dirname+'/jquery-3.3.1.min.js'));
});


app.post('/register', function(request, response) {
	var firstname = request.body.firstname;
	var lastname = request.body.lastname;
	var email = request.body.email;
	var password = request.body.password;
	var birthdate = request.body.birthdate;
	var gender = request.body.gender;

	password = bcrypt.hashSync(password,null,null);

	columns = 'first_name,last_name,email,password,birthdate,gender';
	values = "'"+firstname+"','"+lastname+"','"+email+"','"+password+"','"+birthdate+"','"+gender+"'";

	var nickname = request.body.nickname;
	if(nickname)
	{
		columns += ",nickname";
		values += ",'"+nickname+"'";
	}
	var phone1 = request.body.phone1;
	if(phone1)
	{
		columns += ",phone1";
		values += ",'"+phone1+"'";
	}
	var phone2 = request.body.phone2;
	if(phone2)
	{
		columns += ",phone2";
		values += ",'"+phone2+"'";
	}
	var aboutme = request.body.aboutme;
	if(aboutme)
	{
		columns += ",About_me";
		values += ",'"+aboutme+"'";
	}
	var hometown = request.body.hometown;
	if(hometown)
	{
		columns += ",hometown";
		values += ",'"+hometown+"'";
	}
	var maritalStatus = request.body.maritalStatus;
	if(maritalStatus)
	{
		columns += ",Marital_status";
		values += ",'"+maritalStatus+"'";
	}
	let stmt = 'INSERT INTO users('+columns+') VALUES('+values+');';
	connection.query(stmt, function(error, results, fields) {
		if (error) {
			response.render('register',{
				error: 'Email already exsists login instead'
			});
			console.log(error)
  		}
		else {
			request.session.loggedin = true;
			if(nickname)
				request.session.username = nickname;
			else
				request.session.username = firstname+' '+lastname;
			response.render('index',{
			name: request.session.username
			});
		}			
	});
});

console.log("listening on port: 3000");

app.listen(3000);