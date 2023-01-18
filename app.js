const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

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