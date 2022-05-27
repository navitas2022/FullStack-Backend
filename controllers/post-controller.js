const { validationResult } = require('express-validator');

const HttpError = require('../helpers/http-error');
const db = require('../helpers/db-config');

const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { title, body, user } = req.body;

    const addPost = 'INSERT INTO post (userId, title, body) VALUES (?, ? ,?);'
    db.query(addPost, [user, title, body], (err, response) => {
        if (err) {
            console.log({ err });
            return next(new HttpError('Error adding post to database', 500));
        }

        res.status(201).json({ message: 'Post added successfully' });
    });
};

const getPosts = (req, res, next) => {
    const allPosts = 'SELECT * FROM post;'
    db.query(allPosts, (err, response) => {
        if (err) {
            console.log({ err });
            return next(new HttpError('Error fetching posts from database', 500));
        }

        res.json({ posts: response });
    });
};

const deletePost = (req, res, next) => {
    const id = req.params.id;

    const delPost = 'DELETE FROM post WHERE id=?;'
    db.query(delPost, id, (err, response) => {
        if (err) {
            console.log({ err });
            return next(new HttpError('Error fetching post from database', 500));
        }
        res.json({ message: 'Post deleted successfully' });
    });
};

exports.createPost = createPost;
exports.getPosts = getPosts;
exports.deletePost = deletePost;