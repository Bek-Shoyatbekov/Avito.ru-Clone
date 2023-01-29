const express = require('express');

const userController = require('../controllers/user-controller');

const router = express.Router();


router.get('/signup', userController.getSignUp);


router.post('/signup', userController.signUp);

router.get('/signin', userController.getSignIn);

module.exports = router;