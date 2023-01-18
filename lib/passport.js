module.exports = function(app) {
    const passport = require('passport');
    const LocalStrategy = require('passport-local');

    app.use(passport.initialize());
    app.use(passport.session());

    var authData = {
        email: "email@gmail.com",
        password: "1234",
        nickname: "angari"
    }
    
    passport.serializeUser(function(user, done) {
        done(null, user.email);
    });
    
    passport.deserializeUser(function(id, done) {
        done(null, authData);
    });
    
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        function(username, password, done) {
            if(username === authData.email) {
                if(password === authData.password) {
                    return done(null, authData);
                } else {
                    return done(null, false, {
                        message: '비밀번호 틀림'
                    });
                }
            } else {
                return done(null, false, {
                    message: '이런 계정 없음'
                });
            }
        }
    ));
    return passport;
}