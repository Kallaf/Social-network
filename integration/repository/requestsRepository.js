const connection = require(__dirname + "/connection");

exports.fetchFriendRequests = (currentUserId) => {
    return new Promise(resolve => {
        let sql = `SELECT * from users 
            join requests on users.user_ID = requests.user_id1
            WHERE users.user_ID != ?`;
        connection.query(sql, [currentUserId, currentUserId],
            function(err, results) {
                if (err) console.log(err);
                else resolve(results);
            }
        );
    });
};

exports.fetchYourRequests = (currentUserId) => {
    return new Promise(resolve => {
        let sql = `SELECT * from users 
            join requests on users.user_ID = requests.user_id2
            WHERE users.user_ID != ?`;
        connection.query(sql, [currentUserId, currentUserId],
            function(err, results) {
                if (err) console.log(err);
                else resolve(results);
            }
        );
    });
};

exports.removeFriendRequest = (currentUserId, friendId) => {
    return new Promise(resolve => {
        let sql = 'DELETE FROM requests WHERE ' +
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