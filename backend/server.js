const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
const port = 3001

// let api = require('./routes/index')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,App-Version, Accept,source,accessRigths,authToken");
    next();
});

app.get('/', function (req, res) {
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress
    // console.log(req.ips);
    res.status(200).send(`Cheers!!! server is Up :) from Cores  `)
});

app.use(express.static('ComplaintPics'));

app.use('/auth', require('./routes/auth'))
app.use('/file', require('./routes/file'))
app.use('/complaint', require('./routes/complaint'))
app.use('/dashboard', require('./routes/dashboard'))
app.use('/master', require('./routes/master'))



app.use((req, res, next) => {
    // console.log(' --- Received Request ---');
    // console.log({
    //     url: req.url,
    //     method: req.method,
    //     heders: req.headers,
    //     params: req.params,
    //     query: req.query,
    //     body: req.body
    // });
    let send = res.send;
    res.send = function (body) {
        // console.log(' --- Sending Response ---');
        // console.log({ statusCode: this.statusCode, statusMessage: this.statusMessage });
        send.call(this, body);
    };
    next();
});

const start = async () => {
    try {
        await require('./core/db')
        await app.listen(port)
        console.info(`server  listening at port : ${port}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

start();