const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');

const indexRouter = require('./routes/index.js');
const topicRouter = require('./routes/topic.js');
const authRouter = require('./routes/auth.js');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());
app.use(session({
    secret: 'Secret!',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
}));
app.use(flash());
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
                console.log('로그인 성공');
                return done(null, authData);
            } else {
                console.log('비밀번호 틀림');
                return done(null, false, {
                    message: '비밀번호 틀림'
                });
            }
        } else {
            console.log('이런 계정 없음');
            return done(null, false, {
                message: '이런 계정 없음'
            });
        }
        // if (!user) { return done(null, false); }
        // if (!user.verifyPassword(password)) { return done(null, false); }
        // return done(null, user);
    }
));

app.post('/auth/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

app.get('*',(request, response, next) => {
    fs.readdir(`./data`, function(error, filelist) {
        request.filelist = filelist;
        next();
    });
});

app.use('/',indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use((request, response, next) => {
    response.status(404).send('요청하신 페이지를 찾을 수 없습니다 임마');
});

app.use((error, request, response, next) => {
    console.error(error.stack);
    response.status(500).send('잘못 입력하셨잖아')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});