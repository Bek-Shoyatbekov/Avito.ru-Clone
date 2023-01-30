const uuid = require('uuid');
const User = require("../models/user-model");


const { Op } = require('sequelize');
const Advert = require('../models/advert-model');


require('dotenv').config();

exports.getAddAdvert = async (req, res, next) => {
    try {
        return res.render('addAdvert', { pageTitle: "Add advert", signin: false, signup: false, registered: false });
    } catch (err) {
        return next(err);
    }
}

exports.addProduct = async (req, res, next) => {
    if (typeof req.session.username == 'string') {
        console.log(req.session.username);
        try {
            const user = await User.findAll({
                where: {
                    username: req.session.username
                }
            });
            const { title, category,
                region, imageUrl,
                status, description } = req.body;

            let data = await Advert.create({
                id: 1,
                title: title,
                category: category,
                region: region,
                image: imageUrl,
                status: status,
                description: description
            });
            await data.createUser(user)
            let result = await data.save();
            return res.status(201).send(result)
        } catch (error) {
            return next(error)
        }
    } else {
        return res.status(200).render('404', { pageTitle: "400", signin: true, signup: false, msg: "You are not admin or moderator", registered: false })
    }

}


