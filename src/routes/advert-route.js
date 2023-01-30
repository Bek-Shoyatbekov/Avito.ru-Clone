const express = require('express');

const advertController = require('../controllers/advert-controller');

const router = express.Router();

const { detectUser, isAdmin } = require('../middlewares/auth');


router.get("/add", advertController.getAddAdvert);

router.post('/add', advertController.addProduct)

module.exports = router;