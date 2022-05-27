const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const HttpError = require('../helpers/http-error');
const db = require('../helpers/db-config');

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { email, name, password } = req.body;

    const existingUser = 'SELECT * FROM user WHERE email=?;'
    db.query(existingUser, email, async (err, response) => {
        if (err) {
            console.log({ err });
            return next(new HttpError('Error fetching data from database', 500));
        }

        if (!response || !response.length) {
            let hashedPassword;
            try {
                hashedPassword = await bcrypt.hash(password, 12);
            } catch (error) {
                return next(new HttpError('Password hashing failed. Try again', 500));
            }
            const addUser = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?);'
            db.query(addUser, [name, email, hashedPassword], (error, resp) => {
                if (error) {
                    console.log({ error });
                    return next(new HttpError('Error adding user to database', 500));
                }

                res.status(201).json({ message: 'User registered successfully' });
            });
        }
        else {
            return next(new HttpError('Email already registered', 422));
        }
    });
};

const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { email, password } = req.body;

    const existingUser = 'SELECT * FROM user WHERE email=?;'
    db.query(existingUser, email, async (err, response) => {
        if (err) {
            console.log({ err });
            return next(new HttpError('Error fetching data from database', 500));
        }

        if (!response || !response.length) {
            return next(new HttpError('Email not found', 401));
        }
        else {
            let validPassword;
            try {
                validPassword = await bcrypt.compare(password, response[0].password);
            } catch (error) {
                return next(new HttpError('Error validating password', 500));
            }

            if (!validPassword) {
                return next(new HttpError('Password incorrect', 401));
            }

            res.json({ id: response[0].id, email: response[0].email, name: response[0].name, message: 'Login successful' });
        }
    });
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;