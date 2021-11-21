const express = require('express');
const files = require(__dirname + '/api/routes/files');
const token = require(__dirname + '/api/routes/token');
const users = require(__dirname + '/api/routes/users');
const friends = require(__dirname + '/api/routes/friends');
const requests = require(__dirname + '/api/routes/requests');
const auth = require("./middleware/auth");
const bodyParser = require('body-parser');

const app = express();
app.use("/uploads", express.static('uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/token', token);
app.use('/users', users);
app.use('/friends', auth, friends);
app.use('/requests', auth, requests);
app.use('/files', auth, files);

console.log("listening on port: 3000");

app.listen(3000);