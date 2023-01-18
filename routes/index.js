const express = require('express');
const router = express.Router();
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');

router.get('/', (request, response) => {
    var title = 'Welcome';
    var description = 'Hello Express';
    var list = template.list(request.filelist);
    var HTML = template.HTML(title, list, 
        `<h2>${title}</h2>
        <p>${description}</p>
        <img src="/images/hello.jpg" style="width:200px">`, 
        `<a href="/topic/create">Create</a>`,
        auth.Status(request, response)
    );
    response.send(HTML);
});

module.exports = router;