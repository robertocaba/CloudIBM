const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {authentication} = require('../middleware/authentication');

router.post('/',UserController.create)
router.get('/',authentication,UserController.getAll)
router.delete('/:id',authentication,UserController.delete)
router.put('/:id',authentication,UserController.update)
router.post('/login',UserController.login)
router.delete('/logout',authentication,UserController.logout)
router.get('/confirm/:email',UserController.confirm)

module.exports = router;
