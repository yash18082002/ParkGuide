const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/users');
const catchAsync = require('../util/catchAsync');

router.get('/register', userController.renderSignUp);
router.post('/register', catchAsync(userController.signUp));
router.get('/login', userController.renderSignIn);
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.signIn);
router.get('/logout', userController.signOut);

module.exports = router;