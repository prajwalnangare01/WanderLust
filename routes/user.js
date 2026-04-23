const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError'); 
const {userSchema} = require('../schema.js'); 
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');
const usercontroller = require('../controllers/users.js');

// Middleware for validating user data using Joi
// const validateUser = (req, res, next) => {
//     let { error } = userSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         return next(new ExpressError(400, errMsg));
//     }
//     next();
// };

router.route('/signup')
.get(usercontroller.renderSignupForm)
.post(wrapAsync(usercontroller.signup)); 

router.route('/login')
.get(usercontroller.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureFlash: true, failureRedirect: '/login'}), wrapAsync(usercontroller.login))

router.get("/logout", usercontroller.logout)

module.exports = router;