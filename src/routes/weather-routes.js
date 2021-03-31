const express = require('express');
const path = require('path');
const multer = require('multer');
const { getWeather } = require('../controllers/weather-controllers');

const router = express.Router();

router.route('/')
    .get(getWeather)

module.exports = router;