"use strict";

var WebSocketServer = require('websocket').server;
var http = require('http');
var serveStatic = require('serve-static');
var token = 'abc123';
var API_PORT = 9878;

module.exports = function (app, log) {

  log.info('setting up token & api servers for offline test');

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // do *NOT* do this on a /token endpoint that's accessible to the internet
    next();
  });

  app.use(serveStatic(__dirname));

  app.get('/token', function (req, res) {
    res.json({token: token, url: 'http://localhost:' + API_PORT + '/speech-to-text/api'});
  });

  // after the tests begin running, karma starts rewriting the current line with updates
  // so, if we just log something, it'll get nuked when karma rewrites it
  // to make up for that, this also logs a second blank line for karma to nuke, causing it to leave our actual message alone
  function debug() {
    var args = Array.from(arguments);
    args.unshift('API: ');
    console.log.apply(console, args);
    //console.log('');
  }


  // we don't have access to the actual http server in the karma-express plugin, so just creating a new one on a different port
  // url is /speech-to-text/api/v1/recognize
  var server = http.createServer(function (request, response) {
    debug('Received request for ' + request.url);
    response.writeHead(404);
    response.end();
  });
  server.listen(API_PORT, function () {
    console.log('Mock API server listening at http://localhost:' + server.address().port + '/');
  });

  var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false, // true = emit 'request' events
    maxReceivedFrameSize: 1024*1024 // filestream produces 1mb chunks
  });

  wsServer.on('request', function (request) {
    debug('ws request for ' + request.resource);
    request.accept(null, request.origin);
  });

  var TEXT = 'thunderstorms could produce large hail isolated tornadoes and heavy rain ';
  wsServer.on('connect', function (connection) {

    //debug('Connection accepted.');

    var interim_interval;

    function startInterim() {
      // send fake interim results
      var words = TEXT.split(' ');
      var i = 0;
      return setInterval(function () {
        i++;
        if (i < words.length) {
          //debug('sending interim result');
          connection.sendUTF(JSON.stringify({
            results: [
              {
                final: false,
                alternatives: [
                  {
                    transcript: words.slice(0, i).join(' ')
                  }
                ]
              }
            ]
          }))
        }
      }, 700);
    }

    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        debug('Received Message: ' + message.utf8Data);
        try {
          var msg = JSON.parse(message.utf8Data);
          if (msg.action == 'start') {
            //debug('starting');
            connection.sendUTF('{"state":"listening"}');
            if (msg.interim_results) {
              interim_interval = startInterim();
            }
          } else if (msg.action == 'stop') {
            clearInterval(interim_interval);
            //debug('sending final result')
            connection.sendUTF(JSON.stringify({
              results: [
                //msg.results[0] && msg.results[0].final && msg.results[0].alternatives
                {
                  final: true,
                  alternatives: [
                    {
                      transcript: TEXT
                    }
                  ]
                }
              ]
            }));

            //connection.close();
            connection.sendUTF('{"state":"listening"}'); // The server sends this message out at the end, and then we have to kill the connection from the client
          }
        } catch (ex) {
          debug(ex)
        }
      }
      else if (message.type === 'binary') {
        // this is a mock server, so we aren't going to actually process the binary data
        //debug('Received Binary Message of ' + message.binaryData.length + ' bytes');
      }
    });
    connection.on('close', function (reasonCode, description) {
      clearInterval(interim_interval);
      debug('Peer disconnected:', connection.remoteAddress, reasonCode, description);
    });
  });
};
