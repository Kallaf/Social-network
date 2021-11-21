const connection = require(__dirname + "/database/connection");

exports.fetchFriends = (userID) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from users 
            join friendships on users.userID = friendships.userID1 
                or users.userID = friendships.userID2 
            WHERE users.userID != ?`;
        connection.query(sql, [userID],
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

exports.fetchPeopleYouMayKnow = (id) => {
    return new Promise((resolve, reject) => {
        let friendsIds = `select 
            CASE WHEN userID1<>?
            THEN userID1 
            ELSE userID2 
            END as userID 
        from friendships 
        where userID1 = ? or userID2 = ?`;
        let sql = `SELECT * FROM users WHERE userID NOT IN (` +
            friendsIds + `) and userID <> ?;`
        connection.query(sql, [id, id, id, id],
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

exports.addFriend = (id1, id2) => {
    var createPromise = new Promise((resolve, reject) => {
        let sql = `INSERT INTO friendships(userID1, userID2) VALUES(?, ?);`;
        connection.query(sql, [id1, id2],
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });

    return createPromise.then(() => fetchFriend(id1, id2))
        .catch(err => err);
};

const fetchFriend = (userID1, userID2) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM friendships WHERE (userID1 = ? AND userID2 = ?)
         or (userID2 = ? AND userID2 = ?)`;
        connection.query(sql, [userID1, userID2, userID1, userID2],
            function(err, results) {
                if (err) reject(err);
                else if (!results || !results.length) reject('friendship not found');
                else resolve(results[0]);
            }
        );
    });
};

exports.fetchFriend = fetchFriend;

exports.removeFriend = (currentUserId, friendId) => {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM friendships WHERE ' +
            '(user_id1 = ? and user_id2 = ?)' +
            ' or (user_id1 = ? and user_id2 = ?);';
        connection.query(sql, [
                currentUserId, friendId,
                friendId, currentUserId
            ],
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};