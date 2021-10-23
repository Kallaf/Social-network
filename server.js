const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require(__dirname + '/api/routes/routes');

const app = express();

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}))
app.set('view engine', '.hbs');
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use("/assets", express.static('assets'));
app.use("/uploads", express.static('uploads'));
app.use(routes);

console.log("listening on port: 3000");

app.listen(3000);