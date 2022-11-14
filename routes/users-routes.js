const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post('/login', usersControllers.loginUser);

router.post('/signup', [
    check('username').not().isEmpty(),
    check('password').isLength({ min: 6 }),
    check('email').normalizeEmail().isEmail()
],usersControllers.createUser);

router.patch('/block/:uid', usersControllers.blockUser);

router.patch('/unblock/:uid', usersControllers.unblockUser);

router.patch('/grantadmin/:uid', usersControllers.makeAdmin);

router.patch('/revokeadmin/:uid', usersControllers.makeUser);

router.delete('/delete/:uid', usersControllers.deleteUser);

module.exports = router;