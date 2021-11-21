const express = require("express");
const router = express.Router();
const { fetchFriends } = require(__dirname + '/../../integration/repository/friendsRepository');
const { toUser } = require(__dirname + "/../../service/mappers/userMapper");

router.get('/', function(req, res) {
    return fetchFriends(req.user.id).then(userDBs => {
        let users = userDBs.map(userDB => toUser(userDB));
        return res.status(200).json(users);
    });
});

module.exports = router;