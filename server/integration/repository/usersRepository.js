const connection = require(__dirname + "/database/connection");

exports.fetchUser = (userId) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from users where userID = ?`;
        connection.query(sql, [userId],
            function(err, results) {
                if (err) reject(err);
                else if (!results || !results.length)
                    reject('user not found');
                else resolve(results[0]);
            }
        );
    });
};


const fetchUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM users WHERE email = ?`;
        connection.query(sql, [email],
            function(err, results) {
                if (err) reject(err);
                else if (!results || !results.length) reject('User not found');
                else resolve(results[0]);
            }
        );
    });
};

exports.fetchUserByEmail = fetchUserByEmail;

exports.addUser = (user) => {
    return new Promise((resolve, reject) => {
        var queryParams = createParams(user);
        let sql = 'INSERT INTO users(' + queryParams.columns +
            ') VALUES(' + queryParams.values + ');';
        connection.query(sql,
            function(err, results) {
                if (err) reject(err.sqlMessage);
                else resolve(fetchUserByEmail(user.email));
            }
        );
    });
};

exports.updateProfilePicture = (userId, imageURL) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE users SET profilePicture = ? WHERE userID = ?;`;
        connection.query(sql, [imageURL, userId],
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

const createParams = (user) => {
    var columns = 'firstName, lastName, email, password, birthdate, gender';
    var values = "'" + user.firstname + "','" +
        user.lastname + "','" +
        user.email + "','" +
        user.password + "','" +
        user.birthdate + "','" +
        user.gender + "'";

    if (user.nickname) {
        columns += ",nickname";
        values += ",'" + user.nickname + "'";
    }
    if (user.phone1) {
        columns += ",phone1";
        values += ",'" + user.phone1 + "'";
    }
    if (user.phone2) {
        columns += ",phone2";
        values += ",'" + user.phone2 + "'";
    }
    if (user.about) {
        columns += ",about";
        values += ",'" + user.about + "'";
    }
    if (user.hometown) {
        columns += ",hometown";
        values += ",'" + user.hometown + "'";
    }
    if (user.maritalStatus) {
        columns += ",maritalStatus";
        values += ",'" + user.maritalStatus + "'";
    }
    return {
        columns: columns,
        values: values
    };
};