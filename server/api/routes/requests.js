const express = require("express");
const router = express.Router();
const { addFriend, fetchFriend } = require(__dirname + '/../../integration/repository/friendsRepository');
const {
    addFriendRequest,
    fetchSentRequests,
    fetchFriendRequests,
    fetchFriendRequestByID,
    removeFriendRequest
} = require(__dirname + '/../../integration/repository/requestsRepository');
const { toUser } = require(__dirname + "/../../service/mappers/userMapper");

router.post('/:id', function(req, res) {
    var userId = req.user.id;
    var friendId = req.params.id;
    return fetchFriend(userId, friendId)
        .then(() => res.status(400).json({ err: "already friends" }))
        .catch(() => {
            return addFriendRequest(userId, friendId).then((friendRequest) => {
                return res.status(201).json(friendRequest);
            }).catch(err => res.status(403).json({ err: "already exists" }));
        });
});

router.post('/accept/:id', function(req, res) {
    return fetchFriendRequestByID(req.params.id)
        .then(friendRequest => {
            if (friendRequest.recieverID != req.user.id)
                return res.status(401).send("permission denied");
            return Promise.all([
                addFriend(friendRequest.senderID, friendRequest.recieverID),
                removeFriendRequest(friendRequest.requestID)
            ]).then((results) => {
                return res.status(201).json(results[0]);
            });
        }).catch(err => res.status(403).send(err));
});

router.post('/cancel/:id', function(req, res) {
    return fetchFriendRequestByID(req.params.id)
        .then(friendRequest => {
            if (friendRequest.senderID != req.user.id)
                return res.status(401).send("permission denied");
            return removeFriendRequest(friendRequest.requestID).then(() => {
                return res.status(200).send("request has been cancelled");
            });
        }).catch(err => res.status(403).send(err));
});


router.post('/reject/:id', function(req, res) {
    return fetchFriendRequestByID(req.params.id)
        .then(friendRequest => {
            if (friendRequest.recieverID != req.user.id)
                return res.status(401).send("permission denied");
            return removeFriendRequest(friendRequest.requestID).then(() => {
                return res.status(200).send("request has been rejected");
            });
        }).catch(err => res.status(403).send(err));
});

router.get('/', function(req, res) {
    return fetchFriendRequests(req.user.id).then(userDBs => {
        let users = userDBs.map(userDB => toUser(userDB));
        return res.status(200).json(users);
    });
});

router.get('/sent', function(req, res) {
    return fetchSentRequests(req.user.id).then(userDBs => {
        let users = userDBs.map(userDB => toUser(userDB));
        return res.status(200).json(users);
    });
});

module.exports = router;