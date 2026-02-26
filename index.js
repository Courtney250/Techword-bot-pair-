const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
code = require('./pair');
require('events').EventEmitter.defaultMaxListeners = 500;
app.use('/code', code);
app.use('/pair',async (req, res, next) => {
res.sendFile(__path + '/pair.html')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, '0.0.0.0', () => {
    console.log(`📡 Connected on http://0.0.0.0:` + port)
})

module.exports = app
