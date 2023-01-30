const express = require('express');

const userController = require('../controllers/user-controller');

const router = express.Router();

const { detectUser, strictCheck } = require('../middlewares/auth');


router.get("/home", userController.getHome);

router.get('/signup', userController.getSignUp);

router.post('/signup', userController.signUp);

router.get('/signin', userController.getSignIn);

router.post('/signin', userController.signIn);


module.exports = router;