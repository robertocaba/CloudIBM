const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const {authentication, isAdmin} = require('../middleware/authentication');

router.post('/',authentication, isAdmin, PostController.create)
router.get('/', PostController.getAll)
router.get('/id/:id', PostController.getById)
router.get('/title/:title', PostController.getOneByName)
router.delete('/:id',authentication, isAdmin, PostController.delete)
router.put('/:id',authentication, PostController.update)

module.exports = router;
