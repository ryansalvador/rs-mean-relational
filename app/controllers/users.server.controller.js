'use strict';

/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Show sign up form
 */
exports.renderSignup = function(req, res) {
    var message = null;

    res.render('signup', {
        title: 'Sign up',
        message: message
    });
};

/**
 * Show login form
 */
exports.renderSignin = function(req, res) {
    var message = null;

    res.render('signin', {
        title: 'Signin',
        message: message
    });
};

/**
 * Sign up
 */
exports.signup = function(req, res, next) {
    var message = null;

    var user = db.User.build(req.body);

    user.provider = 'local';
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
    console.log('New User (local) : { id: ' + user.id + ' username: ' + user.username + ' }');
    
    user.save().then(function(){
      req.login(user, function(err){
        if(err) {
            return next(err);
        }
       //return res.send({status : 'success', message : 'User signup successfully.'})
        res.redirect('/');
      });
    }).catch(function(err){
      res.render('users/signup',{
          message: message,
          user: user
      });
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    console.log('Logout: { id: ' + req.user.id + ', username: ' + req.user.username + '}');
    req.logout();
    //return res.send({status : 'success', message : 'User logout successfully.'});
    res.redirect('/');
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Session
 */
exports.session = function(req, res) {
    return res.send({status : 'success', message : 'User login successfully.'})
    // res.redirect('/');
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    db.User.find({where : { id: id }}).then(function(user){
      if (!user) {
          return next(new Error('Failed to load User ' + id));
      }
      req.profile = user;
      next();
    }).catch(function(err){
      next(err);
    });
};

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.profile.id !== req.user.id) {
      return res.status(401).send('User is not authorized');
    }
    next();
};
