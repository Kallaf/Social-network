const express = require("express");
const router = express.Router();
const { updateProfilePicture } = require(__dirname + '/../../integration/repository/usersRepository');
const fileUpload = require("express-fileupload");
const { uploadFile } = require(__dirname + '/../../service/FilesService');
const path = require('path');

router.get('/:fileName', function(req, res) {
    var imageURL = path.join(
        __dirname + '/../../uploads/' + req.params.fileName
    );
    return res.sendFile(imageURL);
});

router.post('/', fileUpload(), function(req, res) {
    var imageURL = uploadFile(req.files);
    updateProfilePicture(req.user.id, imageURL).then(() => {
        res.status(200).json({ imageURL: imageURL });
    }).catch(err => res.status(403).send(err));;
});

router.delete('/', function(req, res) {
    updateProfilePicture(req.user.id, null).then(() => {
        res.status(200).send('profile picture has been removed');
    }).catch(err => res.status(403).send(err));
});

module.exports = router;