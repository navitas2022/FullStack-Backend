const express = require('express');
const { check } = require('express-validator');

const postController = require('../controllers/post-controller');

const router = express.Router();

router.get('/', postController.getPosts);

router.post('/', [
    check('title').not().isEmpty(),
    check('body').not().isEmpty(),
    check('user').toInt().not().isEmpty(),
], postController.createPost);

router.delete('/:id', postController.deletePost);

module.exports = router;