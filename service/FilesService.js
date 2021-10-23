var uuid = require('uuid');
const uploadsURL = '/uploads/';
exports.uploadFile = (file) => {
    if (file) {
        var fileExt = file.profilePicture.name.split('.').pop();
        var fileName = uuid.v4() + '.' + fileExt;
        file.profilePicture.mv(__dirname + '/..' + uploadsURL + fileName);
        return fileName;
    }
};

exports.getFile = (fileName) => {
    return uploadsURL + fileName;
};