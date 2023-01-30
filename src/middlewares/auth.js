const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const config = process.env;

const detectUser = (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        return res.status(403).redirect('/me/signup');
    }
    try {
        const decoded = jwt.verify(token, config.jwt_key);
        req.user = decoded;
    } catch (err) {
        return next(err)
    }
    return next();
};


const isAdmin = async (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        return res.status(401).render('home', { pageTitle: "Home", signup: true, signin: true, registered: false ,username:false});
    }
    try {
        const decoded = jwt.verify(token, config.jwt_key);
        const isAdmin = await User.findByPk(decoded.id);
        if (!isAdmin || isAdmin.length <= 0) {
            return res.status(401).render('/', { pageTitle: "Home", signup: false, signin: false, registered: false ,username:false});
        } else {
            return isAdmin.role == 'admin' ? next() : res.status(401).render('/', { pageTitle: "Home", signup: false, signin: true, registered: false ,username:false});
        }
    } catch (err) {
        return next(err);
    }
};

module.exports = { detectUser, isAdmin };