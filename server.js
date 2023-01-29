"use strict";

const path = require('path');

const Advert = require('./src/models/advert-model');

const Category = require('./src/models/category-model');

const User = require('./src/models/user-model');

const express = require('express');

const connectDB = require('./src/utils/connectionDB');

const cookieParser = require('cookie-parser');

const app = express();

const error_handler = require('./src/utils/error_handler');

const sessions = require('express-session');

require('dotenv').config();

const expiresIn = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: process.env.session_secret,
    saveUninitialized: true,
    cookie: { maxAge: expiresIn },
    resave: false
}))

const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'src/public')));

app.set('view engine', 'ejs');

app.set('views', './src/views');

// Relations 

// User has many adverts
User.hasMany(Advert);

Advert.belongsTo(User, {
    foreignKey: {
        name: "userId"
    }

});

// Category has many Adverts

Category.belongsToMany(Advert, { through: 'attribute' });

Advert.belongsToMany(Category, { through: 'attribute' });



//

app.set('trust proxy', true);

// Routers Here

const userRouter = require('./src/routes/user-route');

app.use((req, res, next) => {
    console.log(`Client Session ID:${req.session.id}`);
    console.log(`Request IP : ${req.ip}`);
    next()
});


app.use('/me', userRouter);

app.get("/", (req, res, next) => {

    return res.render('home', { pageTitle: "Home" });
});

app.use('*', (req, res, next) => {
    try {
        return res.render('404', { pageTitle: "Page not found" });
    } catch (error) {
        return next(error);
    }
})

app.use(error_handler);








// Build DB
connectDB.sync(
    { force: false })
    .then((result) => {
        // console.log(result)
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        })
    }).catch((err) => {
        console.log(err);
    });





