const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user-controller');

const router = express.Router();

router.post('/signup', [
    check('email').isEmail(),
    check('name').not().isEmpty(),
    check('password').not().isEmpty().isLength({ min: 8 }),
], userController.registerUser);

router.post('/login', [
    check('email').isEmail(),
    check('password').not().isEmpty(),
], userController.loginUser);

module.exports = router;