const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sanitizeHTML = require('sanitize-html');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');

var authData = {
    email: "email@gmail.com",
    password: "1234",
    nickname: "angari"
}

router.get('/login', (request, response) => {
    var title = 'Login';
    var list = template.list(request.filelist);
    var HTML = template.HTML(title, list,
        `<form action="/auth/login" method="post">
            <p><input type="text" name="email" placeholder="Email" /></p>
            <p><input type="password" name="password" placeholder="Password" /></p>
            <p><input type="submit" value="Login" /></p>
        </form>`,
        `<h2>${title}</h2>`,
        auth.Status(request, response)
    );
    response.send(HTML);
});

router.post('/login', (request, response) => {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    if(email === authData.email && password === authData.password) {
        request.session.is_login = true;
        request.session.nickname = authData.nickname;
        request.session.save(function() {
            response.redirect(`/`);
        });
    } else {
        response.send('Who?');
    }
});

router.get('/logout', (request, response) => {
    request.session.destroy(function(error) {
        response.redirect('/');
    });
});

module.exports = router;