const connection = require(__dirname + "/connection");

exports.fetchUser = (userId) => {
    return new Promise(resolve => {
        let sql = `SELECT * from users where user_ID = ?`;
        connection.query(sql, [userId],
            function(err, results) {
                if (err) console.log(err);
                else if (!results || !results.length)
                    console.log('user not found');
                else resolve(results[0]);
            }
        );
    });
};


exports.fetchUserByEmail = (email) => {
    return new Promise(resolve => {
        let sql = `SELECT * FROM users WHERE email = ?`;
        connection.query(sql, [email],
            function(err, results) {
                if (err) console.log(err);
                else if (!results || !results.length)
                    console.log('user not found');
                else resolve(results[0]);
            }
        );
    });
};

exports.addUser = (user) => {
    return new Promise((resolve, reject) => {
        var queryParams = createParams(user);
        let sql = 'INSERT INTO users(' + queryParams.columns + ') VALUES(' + queryParams.values + ');';
        connection.query(sql,
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

exports.updateProfilePicture = (userId, imageURL) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE users SET profile_picture = ? WHERE user_ID = ?;`;
        connection.query(sql, [imageURL, userId],
            function(err, results) {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

const createParams = (user) => {
    var columns = 'first_name, last_name, email, password, birthdate, gender';
    var values = "'" + user.firstname + "','" +
        user.lastname + "','" +
        user.email + "','" +
        user.password + "','" +
        user.birthdate + "','" +
        user.gender + "'";

    if (user.nickname) {
        columns += ",nickname";
        values += ",'" + nickname + "'";
    }
    if (user.phone1) {
        columns += ",phone1";
        values += ",'" + user.phone1 + "'";
    }
    if (user.phone2) {
        columns += ",phone2";
        values += ",'" + user.phone2 + "'";
    }
    if (user.aboutme) {
        columns += ",About_me";
        values += ",'" + user.aboutme + "'";
    }
    if (user.hometown) {
        columns += ",hometown";
        values += ",'" + user.hometown + "'";
    }
    if (user.maritalStatus) {
        columns += ",Marital_status";
        values += ",'" + user.maritalStatus + "'";
    }
    return {
        columns: columns,
        values: values
    };
};