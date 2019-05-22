var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser');
var path = require('path');
var bcrypt = require('bcrypt-nodejs')
var fs = require('fs');
var multer = require('multer');
var fileUpload = require("express-fileupload");

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
app.use(express.static('images'));
app.set('view engine','.hbs')


app.get('/', function(request, response) {
	if (request.session.loggedin) {
		response.render('index',{
			name: request.session.username
		});
		} else {
		response.render('login');
	}
});

app.get('/images/:imageName', function(request, response) {
	response.sendFile(path.join(__dirname + '/images/'+request.params.imageName));
});

app.get('/login', function(request, response) {
		response.render('login');
});


app.get('/register', function(request, response) {
		response.render('register');
});


function openIndex(request,response)
{
	response.render('index',{
			name: request.session.username,
			imgURL: request.session.profilePicture
	});
}


app.get('/notFriends', function(request, response) {
		var notFriends = [];
		connection.query('SELECT * from (SELECT * from users LEFT JOIN (select * from friends where user_id1=? or user_id2=?)temp1 ON (users.user_ID = temp1.user_ID1 or users.user_ID = temp1.user_ID2) where users.user_ID != ? and temp1.user_ID1 is null and temp1.user_ID2 is null) temp2 left join (select * from requests where user_id1=? or user_id2=?)temp ON (temp2.user_ID = temp.user_ID1 or temp2.user_ID = temp.user_ID2) where temp.user_ID1 is null and temp.user_ID2 is null',[request.session.userID,request.session.userID,request.session.userID,request.session.userID,request.session.userID],function(error, results, fields) {
			
			for(let i=0;i<results.length;i++)
			{
				if(results[i].nickname)
					otherName = results[i].nickname;
				else
					otherName = results[i].first_name+" "+results[i].last_name;
				var other = {
		    		otherName: otherName,
		    		otherId: results[i].user_ID,
		    		imgURL: results[i].profile_picture
		  		}
		  		notFriends.push(other);
			}			
		});
		response.render('notFriends',{notFriends: notFriends});
});

app.get('/friends', function(request, response) {
		var friends = [];
		connection.query('SELECT * from users inner join (SELECT * FROM `friends` WHERE user_ID1=? or user_ID2=?) temp on users.user_ID = temp.user_id1 or users.user_ID = temp.user_id2 WHERE users.user_ID != ?',[request.session.userID,request.session.userID,request.session.userID],function(error, results, fields) {
			for(let i=0;i<results.length;i++)
			{
				if(results[i].nickname)
					otherName = results[i].nickname;
				else
					otherName = results[i].first_name+" "+results[i].last_name;
				var other = {
		    		otherName: otherName,
		    		otherId: results[i].user_ID,
		    		imgURL: results[i].profile_picture
		  		}
		  		friends.push(other)	
			}
		});
		response.render('friends',{friends: friends});
});

app.get('/yourRequest', function(request, response) {
		var myrequests = [];
		connection.query('SELECT * from users inner join (SELECT user_id2 FROM `requests` WHERE user_ID1=?) temp on users.user_ID = temp.user_id2;',[request.session.userID],function(error, results, fields) {
				for(let i=0;i<results.length;i++)
				{
					if(results[i].nickname)
						otherName = results[i].nickname;
					else
						otherName = results[i].first_name+" "+results[i].last_name;
					var other = {
			    		otherName: otherName,
			    		otherId: results[i].user_ID,
			    		imgURL: results[i].profile_picture
			  		}
			  		myrequests.push(other)	
				}
		});
		response.render('yourRequest',{myrequests: myrequests});
});

app.get('/friendRequests', function(request, response) {
		var peopleRequests = [];
		connection.query('SELECT * from users inner join (SELECT user_id1 FROM `requests` WHERE user_ID2=?) temp on users.user_ID = temp.user_id1;',[request.session.userID],function(error, results, fields) {
			for(let i=0;i<results.length;i++)
			{
				if(results[i].nickname)
					otherName = results[i].nickname;
				else
					otherName = results[i].first_name+" "+results[i].last_name;
				var other = {
		    		otherName: otherName,
		    		otherId: results[i].user_ID,
		    		imgURL: results[i].profile_picture
		  		}
		  		peopleRequests.push(other)
			}
		});
		response.render('friendRequests',{peopleRequests: peopleRequests});
});

app.post('/register', fileUpload(), function(request, response) {
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

	var profilePicture;
	if (request.files === null || request.files === undefined)
	{
		if(gender == 'M')
			profilePicture = "maleDefault.png";
		else
			profilePicture = "femaleDefault.jpg";
	}else
	{
		profilePicture = request.files.profilePicture.name;
		request.files.profilePicture.mv(__dirname + '/images/' + profilePicture);
	}

	columns += ",profile_picture";
	values += ",'/images/"+profilePicture+"'";

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

			connection.query('SELECT * FROM users WHERE email = ?', [email], function(error, results, fields) {
				request.session.userID = results[0].user_ID;
				request.session.profilePicture = results[0].profile_picture;
				request.session.gender = results[0].gender;
			openIndex(request,response);
		});

		}			
	});

});


app.post('/login', function(request, response) {
	var email = request.body.email;
	var password = request.body.password;

	connection.query('SELECT * FROM users WHERE email = ?', [email], function(error, results, fields) {
		if (results.length > 0) {
			if(!bcrypt.compareSync(password,results[0].password))
			{
				response.render('login',{
					error: "Wrong password"
				});
			}else
			{
				request.session.loggedin = true;
				if(results[0].nickname)
					request.session.username = results[0].nickname;
				else
					request.session.username = results[0].first_name+' '+results[0].last_name;
				request.session.userID = results[0].user_ID;
				request.session.profilePicture = results[0].profile_picture;
				request.session.gender = results[0].gender;
				openIndex(request,response);
			}
		} else {
			response.render('login',{
				error: "Email doesn't exsist"
			});
		}			
	});
});


app.post('/addFriend', function(request, response) {
	var otherId = request.body.otherId;
	values = "'"+request.session.userID+"','"+otherId+"'";
	let stmt = 'INSERT INTO requests(user_id1,user_id2) VALUES('+values+');';
	connection.query(stmt, function(error, results, fields) {
		openIndex(request,response);
	});
});

app.post('/removeFriend', function(request, response) {
	var otherId = request.body.otherId;
	let stmt = 'DELETE FROM friends WHERE (user_id1 = '+request.session.userID+' and user_id2 = '+otherId+') or (user_id1 = '+otherId+' and user_id2 = '+request.session.userID+');';
	connection.query(stmt, function(error, results, fields) {
		openIndex(request,response);
	});
});

app.post('/acceptRequest', function(request, response) {
	var otherId = request.body.otherId;
	values = "'"+request.session.userID+"','"+otherId+"'";
	let stmt = 'INSERT INTO friends(user_id1,user_id2) VALUES('+values+');';
	
	connection.query(stmt, function(error, results, fields) {
		//do nothing
	});
	stmt = 'DELETE FROM requests WHERE user_id1 = '+otherId+' and user_id2 = '+request.session.userID+';'
	connection.query(stmt, function(error, results, fields) {
		openIndex(request,response);
	});
});

app.post('/cancelRequest', function(request, response) {
	var otherId = request.body.otherId;
	let stmt = 'DELETE FROM requests WHERE user_id1 = '+request.session.userID+' and user_id2 = '+otherId+';'
	connection.query(stmt, function(error, results, fields) {
		openIndex(request,response);
	});
});

app.post('/notFriendPage', function(request, response) {
		var otherId = request.body.otherId;
		connection.query('SELECT * from users where user_ID = ?',[otherId],function(error, results, fields) {
				response.render('notFriendPage',{
	    		firstname: results[0].first_name,
				lastname: results[0].last_name,
				nickname: results[0].nickname,
				email: results[0].email,
				phone1: results[0].phone1,
				phone2: results[0].phone2,
				hometown: results[0].hometown,
				maritalStatus: results[0].Marital_status,
				imgURL: results[0].profile_picture
	  		});
		});
});

app.post('/friendPage', function(request, response) {
		var otherId = request.body.otherId;
		connection.query('SELECT * from users where user_ID = ?',[otherId],function(error, results, fields) {
				response.render('friendPage',{
	    		firstname: results[0].first_name,
				lastname: results[0].last_name,
				nickname: results[0].nickname,
				email: results[0].email,
				phone1: results[0].phone1,
				phone2: results[0].phone2,
				hometown: results[0].hometown,
				birthdate: results[0].birthdate,
				aboutme: results[0].About_me,
				maritalStatus: results[0].Marital_status,
				imgURL: results[0].profile_picture
	  		});
		});
});

app.post('/changeImage', fileUpload(), function(request, response) {
	if (request.files != null && request.files != undefined)
	{
		var profilePicture = request.files.profilePicture.name;
		request.files.profilePicture.mv(__dirname + '/images/' + profilePicture);

		stmt = "UPDATE users SET profile_picture = '/images/"+profilePicture+"' WHERE user_ID = "+request.session.userID+";";
		connection.query(stmt, function(error, results, fields) {
			request.session.profilePicture = "/images/"+profilePicture;
			openIndex(request,response);	
		});
	}

});

app.post('/removeImage', fileUpload(), function(request, response) {
	var profilePicture = "femaleDefault.jpg";
	if(request.session.gender == 'M')
		profilePicture = "maleDefault.png";

	stmt = "UPDATE users SET profile_picture = '/images/"+profilePicture+"' WHERE user_ID = "+request.session.userID+";";

	connection.query(stmt, function(error, results, fields) {
		request.session.profilePicture = "/images/"+profilePicture;
		openIndex(request,response);	
	});

});

console.log("listening on port: 3000");

app.listen(3000);