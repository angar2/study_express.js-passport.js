const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sanitizeHTML = require('sanitize-html');
const passport = require('passport');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');

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
    failureFlash: true
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