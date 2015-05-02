var Promise    = require('native-promise-only');
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var server     = require('http').createServer(app);
var io         = require('socket.io').listen(server);
var Redis      = require('ioredis');
var moment     = require('moment');

var _connections = 0;
var _channelWatchList = [];

var PORT = 8001;
var REDIS_PORT = 6379;
var REDIS_HOST = 'localhost';

// create new connection for redis
var redisClient = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  db: 5
});
// var redisPublicClient = redis.createClient(REDIS_PORT, REDIS_HOST);


// Express config

// bodyParser may be deprecate, look into it.
// http://expressjs.com/guide/migrating-4.html#changes

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static(__dirname + '/client/www'));

server.listen(PORT, function() {
  console.log('App is now listening on port: ' + PORT);
});

redisClient.set('user:josh', moment());
