const connection = require(__dirname + "/database/connection");

exports.fetchFriendRequests = (userID) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from users 
            join requests on users.userID = requests.senderID
            and requests.recieverID = ?`;
        connection.query(sql, [userID],
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

exports.fetchSentRequests = (userID) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from users 
            join requests on users.userID = requests.recieverID
            and requests.senderID = ?`;
        connection.query(sql, [userID],
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

exports.addFriendRequest = (senderID, recieverID) => {
    var createPromise = new Promise((resolve, reject) => {
        let sql = `INSERT INTO requests(senderID, recieverID) VALUES(?, ?);`;
        connection.query(sql, [senderID, recieverID],
            function(err, results) {
                if (err) reject(err.sqlMessage);
                else resolve(results);
            }
        );
    });

    return createPromise.then(
        () => fetchFriendRequest(senderID, recieverID)
    ).catch(err => err);
};

const fetchFriendRequest = (senderID, recieverID) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM requests WHERE senderID = ? AND recieverID = ?`;
        connection.query(sql, [senderID, recieverID],
            function(err, results) {
                if (err) reject(err);
                else if (!results || !results.length) reject('request not found');
                else resolve(results[0]);
            }
        );
    });
};

exports.fetchFriendRequestByID = (requestID) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM requests WHERE requestID = ?`;
        connection.query(sql, [requestID],
            function(err, results) {
                if (err) reject(err);
                else if (!results || !results.length) reject('request not found');
                else resolve(results[0]);
            }
        );
    });
};;

exports.removeFriendRequest = (requestID) => {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM requests WHERE requestID = ?;';
        connection.query(sql, [requestID],
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};