const db = require('../lib/db.js');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

module.exports = function(app) {
    const passport = require('passport');
    const LocalStrategy = require('passport-local');
    const GoogleStrategy = require('passport-google-oauth20').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        var user = db.get('users').find({id: id}).value();
        done(null, user);
    });
    
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        function(email, password, done) {
            var user = db.get('users').find({
                email: email
            }).value();
            if(user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if(result){
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: '비밀번호 틀림'
                        });
                    }
                });
            } else {
                return done(null, false, {
                    message: '이런 계정 없음'
                });
            }
        }
    ));

    var googleCredentials = require('../config/google.json');
    passport.use(new GoogleStrategy({
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0]
      },
      function(accessToken, refreshToken, profile, cb) {
        var email= profile._json.email;
        var user = db.get('users').find({email: email}).value();
        if(user) {
            user.googleId = profile.id;
            db.get('users').find({id: user.id}).assign(user).write();
        } else {
            user = {
                id: shortid.generate(),
                email: email,
                displayName: profile.displayName,
                googleId: profile.id
            }
            db.get('users').push(user).write();
        }
        cb(null, user);
      }
    ));
    
    app.get('/auth/google',
        passport.authenticate('google', { 
            scope: ['profile', 'email']
        })
    );

    app.get('/auth/google/callback', 
        passport.authenticate('google', {
            failureRedirect: 'auth/login' 
        }),
        function(req, res) {
            res.redirect('/');
    });

    return passport;
}