const { fetchUser } = require(__dirname + '/../../integration/repository/usersRepository');
const router = require("express").Router();
const auth = require(__dirname + "/../../middleware/auth");
const { toUser } = require(__dirname + "/../../service/mappers/userMapper");
const { fetchPeopleYouMayKnow } = require(__dirname + '/../../integration/repository/friendsRepository');

router.get('/others', auth, function(req, res) {
    fetchPeopleYouMayKnow(req.user.id).then(userDBs => {
        let others = userDBs.map(userDB => toUser(userDB));
        return res.status(200).json(others);
    });
});

router.get('/:id', function(req, res) {
    return fetchUser(req.params.id).then(userDB => {
        var user = toUser(userDB);
        return res.status(200).json(user);
    });
});

module.exports = router;