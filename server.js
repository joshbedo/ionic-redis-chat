var Promise    = require('native-promise-only');
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var server     = require('http').createServer(app);
var io         = require('socket.io').listen(server);
var Redis      = require('ioredis');
var moment     = require('moment');

var connections = 0;
var _channelWatchList = [];

var PORT = 1337;
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

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

server.listen(PORT, function() {
  console.log('App is now listening on port: ' + PORT);
});

// Routes -- probably seperate into a module
app.post('/login', function(req,resp) {
  var _name = req.param('name');
  var _password = req.param('password'); // I should use encypt later.

  if (!_name || !_password) return;
  console.log('Password attempt by: ' + _name + ' at: ' + moment());

  if (_password == 'password') {
    var userKey = 'user:' + _name;
    redisClient.set(userKey, moment());
    connections++;
    resp.send({ success: true, name: _name, id: connections });
  } else {
    resp.send({ success: false, error: 'wrong username and password' }, 422);
  }
});


// Socket events
io.on('connection', function(socket) {
  var counter = 0;
  console.log('User has connected');

  socket.on('disconnect', function() {
    console.log('User has disconnected');
  });

  socket.on('user:joined', function(user) {
    var message = user.name + ' joined the room';
    io.emit('user:joined', { message: message, time: moment(), expires: moment().add(10) });
  });
});
