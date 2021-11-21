exports.toUser = (userDB) => {
    return {
        userID: userDB.userID,
        firstname: userDB.firstName,
        lastname: userDB.lastName,
        nickname: userDB.nickname,
        email: userDB.email,
        phone1: userDB.phone1,
        phone2: userDB.phone2,
        hometown: userDB.hometown,
        birthdate: userDB.birthdate,
        about: userDB.about,
        maritalStatus: userDB.Marital_status,
        imgURL: userDB.profilePicture
    };
}