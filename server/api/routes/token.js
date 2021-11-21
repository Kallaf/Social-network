const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const jwt = require("jsonwebtoken");
const {
    addUser,
    fetchUserByEmail
} = require(__dirname + '/../../integration/repository/usersRepository');
require("dotenv").config();

router.post('/register', function(req, res) {
    var user = req.body;
    user.password = bcrypt.hashSync(user.password, null, null);
    return addUser(user).then(_user => {
        var token = createUserToken(_user);
        return res.status(201).json({ token: token, userID: _user.userID });
    }).catch((err) => {
        return res.status(409).send(err);
    });
});

router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    fetchUserByEmail(email).then(user => {
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).send("Wrong password");
        } else {
            var token = createUserToken(user);
            return res.status(200).json({ token: token, userID: user.userID });
        }
    }).catch((err) => {
        return res.status(404).send(err);
    });;
});

const createUserToken = (user) => {
    return jwt.sign({ id: user.userID, email: user.email },
        process.env.TOKEN_KEY, {
            expiresIn: "2h",
        }
    );
}

module.exports = router;