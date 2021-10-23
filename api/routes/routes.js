const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const fileUpload = require("express-fileupload");
const {
    fetchPeopleYouMayKnow,
    fetchFriends,
    addFriend,
    removeFriend
} = require(__dirname + '/../../integration/repository/friendsRepository');
const {
    fetchYourRequests,
    fetchFriendRequests,
    removeFriendRequest
} = require(__dirname + '/../../integration/repository/requestsRepository');
const {
    addUser,
    fetchUser,
    fetchUserByEmail,
    updateProfilePicture
} = require(__dirname + '/../../integration/repository/usersRepository');
const {
    uploadFile,
    getFile
} = require(__dirname + '/../../service/FilesService');
const router = require("express").Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/', function(request, response) {
    if (request.session.loggedin) {
        response.render('index', {
            name: request.session.username
        });
    } else {
        response.render('login');
    }
});

router.get('../images/:imageName.', function(request, response) {
    response.sendFile(path.join(__dirname + '.../images/' + request.params.imageName));
});

router.get('/login', function(request, response) {
    response.render('login');
});


router.get('/register', function(request, response) {
    response.render('register');
});

function openIndex(request, response) {
    response.render('index', {
        name: request.session.username,
        imgURL: request.session.profilePicture
    });
}

router.get('/peopleYouMayKnow', function(request, response) {
    fetchPeopleYouMayKnow(request.session.userID).then(results => {
        let peopleYouMayKnow = [];
        for (let i = 0; i < results.length; i++) {
            if (results[i].nickname)
                otherName = results[i].nickname;
            else
                otherName = results[i].first_name + " " + results[i].last_name;
            var other = {
                otherName: otherName,
                otherId: results[i].user_ID,
                imgURL: results[i].profile_picture
            }
            peopleYouMayKnow.push(other);
        }
        response.render('peopleYouMayKnow', { peopleYouMayKnow: peopleYouMayKnow });
    });
});

router.post('/peopleYouMayKnowPage', function(request, response) {
    fetchUser(request.body.otherId).then(user => {
        response.render('peopleYouMayKnowPage', {
            firstname: user.first_name,
            lastname: user.last_name,
            nickname: user.nickname,
            email: user.email,
            phone1: user.phone1,
            phone2: user.phone2,
            hometown: user.hometown,
            maritalStatus: user.Marital_status,
            imgURL: user.profile_picture
        });
    });
});

router.get('/friends', function(request, response) {
    fetchFriends(request.session.userID).then(results => {
        var friends = [];
        for (let i = 0; i < results.length; i++) {
            if (results[i].nickname)
                otherName = results[i].nickname;
            else
                otherName = results[i].first_name + " " + results[i].last_name;
            var other = {
                otherName: otherName,
                otherId: results[i].user_ID,
                imgURL: results[i].profile_picture
            }
            friends.push(other)
        }
        response.render('friends', { friends: friends });
    });
});

router.post('/friendPage', function(request, response) {
    fetchUser(request.body.otherId).then(user => {
        response.render('friendPage', {
            firstname: user.first_name,
            lastname: user.last_name,
            nickname: user.nickname,
            email: user.email,
            phone1: user.phone1,
            phone2: user.phone2,
            hometown: user.hometown,
            birthdate: user.birthdate,
            aboutme: user.About_me,
            maritalStatus: user.Marital_status,
            imgURL: user.profile_picture
        });
    });
});

router.get('/yourRequests', function(request, response) {
    fetchYourRequests(request.session.userID).then(results => {
        var myrequests = [];
        for (let i = 0; i < results.length; i++) {
            if (results[i].nickname)
                otherName = results[i].nickname;
            else
                otherName = results[i].first_name + " " + results[i].last_name;
            var other = {
                otherName: otherName,
                otherId: results[i].user_ID,
                imgURL: results[i].profile_picture
            }
            myrequests.push(other)
        }
        response.render('yourRequests', { myrequests: myrequests });
    });
});

router.get('/friendRequests', function(request, response) {
    fetchFriendRequests(request.session.userID).then(results => {
        var peopleRequests = [];
        for (let i = 0; i < results.length; i++) {
            if (results[i].nickname)
                otherName = results[i].nickname;
            else
                otherName = results[i].first_name + " " + results[i].last_name;
            var other = {
                otherName: otherName,
                otherId: results[i].user_ID,
                imgURL: results[i].profile_picture
            }
            peopleRequests.push(other)
        }
        response.render('friendRequests', { peopleRequests: peopleRequests });
    });
});

router.post('/addFriend', function(request, response) {
    var userId = request.session.userID;
    var friendId = request.body.otherId;
    addFriend(userId, friendId).then(() => {
        openIndex(request, response);
    });
});

router.post('/removeFriend', function(request, response) {
    var userId = request.session.userID;
    var friendId = request.body.otherId;
    removeFriend(userId, friendId).then(() => {
        openIndex(request, response);
    });
});

router.post('/acceptRequest', function(request, response) {
    var userId = request.session.userID;
    var friendId = request.body.otherId;
    Promise.all([
        addFriend(userId, friendId),
        removeFriendRequest(userId, friendId)
    ]).then(() => {
        openIndex(request, response);
    });
});

router.post('/cancelRequest', function(request, response) {
    var userId = request.session.userID;
    var friendId = request.body.otherId;
    removeFriendRequest(userId, friendId).then(() => {
        openIndex(request, response);
    });
});

router.post('/register', function(request, response) {
    var user = request.body;
    user.password = bcrypt.hashSync(user.password, null, null);
    addUser(user).then(() => {
        fetchUserByEmail(user.email).then(_user => {
            setSessionValues(request, _user);
            openIndex(request, response);
        });
    }).catch((err) => {
        response.render('register', {
            error: 'Email already exists'
        });
        console.log(err);
    });
});

router.post('/login', function(request, response) {
    var email = request.body.email;
    var password = request.body.password;
    fetchUserByEmail(email).then(user => {
        if (!bcrypt.compareSync(password, user.password)) {
            response.render('login', {
                error: "Wrong password"
            });
        } else {
            setSessionValues(request, user);
            openIndex(request, response);
        }
    });
});

const setSessionValues = (request, user) => {
    request.session.loggedin = true;
    request.session.userID = user.user_ID;
    request.session.gender = user.gender;
    request.session.username = user.nickname ? user.nickname :
        user.firstname + ' ' + user.lastname;
    setSessionProfilePicture(request.session, user.profile_picture);
}

router.post('/changeImage', fileUpload(), function(request, response) {
    var fileName = uploadFile(request.files);
    updateProfilePicture(request.session.userID, fileName).then(() => {
        setSessionProfilePicture(request.session, fileName);
        openIndex(request, response);
    });

});

router.post('/removeImage', fileUpload(), function(request, response) {
    updateProfilePicture(request.session.userID, null).then(() => {
        setSessionProfilePicture(request.session, null);
        openIndex(request, response);
    });
});

const setSessionProfilePicture = (session, fileName) => {
    if (session) {
        if (fileName) {
            session.profilePicture = getFile(fileName);
        } else {
            var profilePicture = session.gender === 'M' ?
                "maleDefault.png" : "femaleDefault.jpg";
            session.profilePicture = 'assets/' + profilePicture;
        }
    }
}

module.exports = router;