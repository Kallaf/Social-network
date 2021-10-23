const connection = require(__dirname + "/connection");

exports.fetchFriends = (currentUserId) => {
    return new Promise(resolve => {
        let sql = `SELECT * from users 
            join friends on users.user_ID = friends.user_id1 
                or users.user_ID = friends.user_id2 
            WHERE users.user_ID != ?`;
        connection.query(sql, [currentUserId],
            function(err, results) {
                if (err) console.log(err);
                else resolve(results);
            }
        );
    });
};

exports.fetchPeopleYouMayKnow = (currentUserId) => {
    return new Promise(resolve => {
        let friendsIds = `select 
            CASE WHEN user_ID1<>3 
            THEN user_ID1 
            ELSE user_ID2 
            END as user_ID 
        from friends 
        where user_ID1 = ?1 or user_ID2 = ?1`;
        let sql = `SELECT * FROM users WHERE user_ID NOT IN (` +
            friendsIds + `) and user_ID <> ?;`
        connection.query(sql, [currentUserId, currentUserId, currentUserId],
            function(err, results) {
                if (err) console.log(err);
                else resolve(results);
            }
        );
    });
};

exports.addFriend = (currentUserId, friendId) => {
    return new Promise(resolve => {
        let sql = `INSERT INTO requests(user_id1, user_id2) VALUES(?, ?);`;
        connection.query(sql, [currentUserId, friendId],
            function(err, results) {
                if (err) console.log(err);
                else resolve(results);
            }
        );
    });
};

exports.removeFriend = (currentUserId, friendId) => {
    return new Promise(resolve => {
        let sql = 'DELETE FROM friends WHERE ' +
            '(user_id1 = ? and user_id2 = ?)' +
            ' or (user_id1 = ? and user_id2 = ?);';
        connection.query(sql, [
                currentUserId, friendId,
                friendId, currentUserId
            ],
            function(err, results) {
                if (err) console.log(err);
                else resolve(results);
            }
        );
    });
};