var express = require('express');
var router = express.Router();
var passport = require('passport');

// require  user models
var User = require('../models/users');

    // routes for home page
    router.get('/', (req, res) => {
         res.render('index.ejs');
    });

    // route for showing the profile page
    router.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // route for logging out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //////////////// GOOGLE ROUTES ////////////////
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails

    /*router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));*/


    router.get('/auth/google',passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));


    // the callback after google has authenticated the user
    // means everything is correct.
    router.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next){

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }


module.exports = router;