const db = require('../lib/db.js');
const bcrypt = require('bcrypt');

module.exports = function(app) {
    const passport = require('passport');
    const LocalStrategy = require('passport-local');

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
    return passport;
}