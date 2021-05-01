const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {

	const { name, email, password, password2 } = req.body;

	function stringGen() {
		var text = "";
		var len = 10;
		var char_list =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < len; i++) {
			text += char_list.charAt(Math.floor(Math.random() * char_list.length));
		}
		return text;
	}

	userID = stringGen()

	let errors = [];

	if (!name || !email || !password || !password2) {
		errors.push({ msg: 'Please enter all fields' });
	}

	if (password != password2) {
		errors.push({ msg: 'Passwords do not match' });
	}

	if (password.length < 6) {
		errors.push({ msg: 'Password must be at least 6 characters' });
	}

	if (errors.length > 0) {
		res.render('register', { errors, name, email, password, password2 });
	}
	else {
		User.findOne({ email: email }).then(user => {
			if (user) {
				errors.push({ msg: 'Email already exists' });
				res.render('register', {
					errors,
					name,
					email,
					password,
					password2
				});
			}
			else {


				const newUser = new User({
					name,
					email,
					password,
					userID
				});

				bcrypt.genSalt(10, (err, salt) => {

					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then(user => {
								req.flash('success_msg', 'You are now registered and can log in');
								res.redirect('/users/login');
							})
							.catch(err => console.log(err));
					});
				});
			}
		});
	}
});

// Login
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/index',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;