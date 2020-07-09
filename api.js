var constant=require("./CONSTANTS");
var express = require('express');
var forwarder = require('./forwarder');
var hausala = require('./hausala');
var bcpm = require('./bcpm');

var cron = require('node-cron');

cron.schedule("0 0 12 1 * *", function() {
    new hausala();
});
cron.schedule("0 0 12 2 * *", function() {
    new bcpm();
});
/*
     * * * * * *
     | | | | | |
     | | | | | day of week
     | | | | month
     | | | day of month
     | | hour
     | minute
     second ( optional )
 */


var argv = require('yargs').argv;


//var rootCas = require('ssl-root-cas/latest').create();
//require('https').globalAgent.options.ca = rootCas;
forwarder = new forwarder();

// Initialise
var app = express();
/**
 * Set up CORS Settings
 */ app.use(function (req, res, next) {

     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', '*');

     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

     // Request headers you wish to allow
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

     // Pass to next layer of middleware
     next();
 });/**
     */
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


/** Set Up Logging
 */ var winston = require('winston');
global.__logger = new (winston.Logger)({
    level : 'silly',
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            timestamp: true
        }),
         new (winston.transports.File)({
             
filename: './logs/server.log',
             timestamp: true
         })
    ]
});
// Open API
function getDashboard(){
    app.get('/portalAPI/*', function(req, res){
        var name = req.query.name
        var tei =req.query.tei
        var ou = req.query.ou;
        forwarder.pass(req,function(result){

            res.writeHead(200, {'Content-Type': 'json'});
            res.end(result);
        });

    })
}


switch(argv.portal){
    case 'hausala' : new hausala();
        break;
    case 'bcpm' : new bcpm();
        break;
    default : __logger.info("No Portal specified ");
        break;
}
__logger.info("Starting service");






