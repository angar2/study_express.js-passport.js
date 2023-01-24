const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sanitizeHTML = require('sanitize-html');
const passport = require('passport');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
const db = require('../lib/db.js');

router.get('/signup', (request, response) => {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error) {
        feedback = `<p>${fmsg.error[0]}</p>`;
    }
    var title = 'Sign up';
    var list = template.list(request.filelist);
    var HTML = template.HTML(title, list,
        `<form action="/auth/signup" method="post">
            <p><input type="text" name="email" placeholder="Email" /></p>
            <p><input type="password" name="password" placeholder="Password" /></p>
            <p><input type="password" name="password2" placeholder="Confirm Password" /></p>
            <p><input type="text" name="displayName" placeholder="Display Name" /></p>
            ${feedback}
            <p><input type="submit" value="Sign up" /></p>
        </form>`,
        `<h2>${title}</h2>`,
        auth.Status(request, response)
    );
    response.send(HTML);
});

router.post('/signup', (request, response) => {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    var password2 = post.password2;
    var displayName = post.displayName;
    if(password !== password2) {
        request.flash('error','비밀번호 확인 바람');
        response.redirect('/auth/signup');
    } else {
        bcrypt.hash(password, 10, function(err, hash) {
            var user = db.get('users').find({email: email});
            if(user) {
                request.flash('error','계정이 이미 존재함');
                response.redirect('/auth/signup');
            } else {
                db.get('users').push({
                    id: shortid.generate(),
                    email: email,
                    password: hash,
                    displayName: displayName
                }).write();
                response.redirect('/');
            }
        });
    }
});

router.get('/login', (request, response) => {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error) {
        feedback = `<p>${fmsg.error[0]}</p>`;
    }
    var title = 'Login';
    var list = template.list(request.filelist);
    var HTML = template.HTML(title, list,
        `<form action="/auth/login" method="post">
            <p><input type="text" name="email" placeholder="Email" /></p>
            <p><input type="password" name="password" placeholder="Password" /></p>
            ${feedback}
            <p><input type="submit" value="Login" /></p>
        </form>`,
        `<h2>${title}</h2>`,
        auth.Status(request, response)
    );
    response.send(HTML);
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
}));

router.get('/logout', (request, response) => {
    request.logout(function(error) {
        if(error) {
            return next(error); 
        }
        response.redirect('/');
    });
});

module.exports = router;