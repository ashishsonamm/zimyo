const express = require('express');
const router = express.Router();
const ErrorHandler = require("../middleware/error");
const AuthHandler = require('../controller/auth')

router.post('/register', ErrorHandler(AuthHandler.register));

router.post('/login', ErrorHandler(AuthHandler.login));

module.exports = router;