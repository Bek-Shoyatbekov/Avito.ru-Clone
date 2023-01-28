"use strict";

const path = require('path');

const Advert = require('./src/models/advert-model');

const Category = require('./src/models/category-model');

const User = require('./src/models/user-model');

const express = require('express');

const connectDB = require('./src/utils/connectionDB');

const app = express();

require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(express.json());

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



// Routers Here

const userRouter = require('./src/routes/user-route');



app.use('/user', userRouter);

app.get("/", (req, res, next) => {
    return res.render('home', { active: "home" });
});



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





