
const uuid = require('uuid');
const User = require("../models/user-model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const { Op } = require('sequelize');

require('dotenv').config();


exports.getHome = async (req, res, next) => {
    let signin = req.session.token ? true : false;
    let signup = req.session.token ? true : false;
    let adding = signin || signup;
    let name = req.session.username ? req.session.username : false;
    return res.render('home', { pageTitle: "Home", signup: !signup, signin: !signin, username: name, registered: adding });
}

exports.getSignUp = async (req, res, next) => {
    try {
        return res.render('signUp', { pageTitle: "Sign up", signin: true, signup: false, registered: false });
    } catch (error) {
        return next(error);
    }
}

exports.signUp = async (req, res, next) => {
    try {
        const isValidEmail = await User.findAll({
            where: {
                [Op.or]:
                    [
                        { email: req.body.email },
                        { username: req.body.username }
                    ]
            }
        });
        if (isValidEmail.length == 0) {
            let salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const id = uuid.v1();
            const newUser = await User.create({
                id: id,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            const payload = {
                id: id,
                email: newUser.email
            };
            const token = await jwt.sign(payload, process.env.jwt_key, { expiresIn: 360000 });
            const result = await newUser.save();
            req.session.token = token;
            req.session.username = req.body.username;
            // console.log(req.session.token);
            res.status(200).render('home', { pageTitle: "Home", signin: false, signup: false, username: req.session.username, registered: false })
            // return res.status(201).send({ Message: "Signed up successfully", token: token })
        } else {
            return res.send({ Message: "User already exist" });
        }
    } catch (error) {
        return next(error);
    }
};

exports.getSignIn = async (req, res, next) => {
    try {
        return res.render('signIn', { pageTitle: "Sign In", signin: false, signup: true, registered: false });
    } catch (error) {
        return next(error);
    }
}

exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }
        const user = await User.findAll({
            where: {
                email: email
            }
        });
        if (user.length > 0 && user) {
            const isValidPassword = await bcrypt.compare(password, user[0].password);
            if (isValidPassword) {
                const token = jwt.sign(
                    {
                        id: user.id, email
                    },
                    process.env.jwt_key,
                    {
                        expiresIn: "2h",
                    }
                );
                req.session.token = token;
                req.session.username = user[0].username;
                res.status(200).render('home', { pageTitle: "Home", signin: false, signup: false, username: req.session.username, registered: true })
            } else {
                res.status(200).render('404', { pageTitle: "400", signin: false, signup: true, msg: "Email or Password invalid!" })
            }
        } else {
            res.status(200).render('404', { pageTitle: "400", signin: false, signup: true, msg: "User not found!", registered: false })
        }
    } catch (err) {
        return next(err);
    }
};

