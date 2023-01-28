
const uuid = require('uuid');
const User = require("../models/user-model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { Op } = require('sequelize');

require('dotenv').config();

require('dotenv').config();

exports.signUp = async (req, res, next) => {
    try {
        const jwt_key = process.env.jwt_key;
        const isValidEmail = await User.findAll({
            where: {
                [Op.or]: [{ email: req.body.email },
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
        console.log(error);
        return res.status(500).send("Something broke!");
    }

};

exports.signIn = async (req, res, next) => {


};

