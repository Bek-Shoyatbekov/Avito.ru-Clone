
const uuid = require('uuid');
const User = require("../models/user-model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const { Op } = require('sequelize');

require('dotenv').config();

require('dotenv').config();

exports.getSignUp = async (req, res, next) => {
    try {
        return res.render('signUp', { pageTitle: "Sign up" });
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
            console.log(result);
            return res.status(201).send({ Message: "Signed up successfully", token: token })
        } else {
            return res.send({ Message: "User already exist" });
        }
    } catch (error) {
        return next(error);
    }
};

exports.getSignIn = async (req, res, next) => {
    try {
        return res.render('signIn', { pageTitle: "Sign In" });
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

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user.id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            user.token = token;
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        return next(err);
    }

};

