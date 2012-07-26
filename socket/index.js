// Generated by CoffeeScript 1.3.3
(function() {
  "use strict";

  var S, onlines, pushOnlines, _;

  _ = require('underscore')._;

  S = require('string');

  onlines = {
    users: {},
    sessions: {}
  };

  pushOnlines = function(_s) {
    return _s.broadcast.emit('onlines', _.keys(onlines.users));
  };

  module.exports = function(io) {
    io.set('log level', 1);
    return io.sockets.on('connection', function(socket) {
      var ip, sessions, users;
      users = onlines.users;
      sessions = onlines.sessions;
      console.log(socket.handshake.address);
      ip = socket.remoteAddress;
      pushOnlines(socket);
      socket.on('client-session', function(data) {
        var channel, key, user, _i, _len, _ref, _results;
        key = "" + data.project + ":" + data.key + ":" + ip;
        sessions[socket.id] = key;
        user = users[key];
        if (user) {
          user.push(socket.id);
          user = _.uniq(user);
        } else {
          users[key] = [socket.id];
          socket.broadcast.emit('add_user', key);
          pushOnlines(socket);
        }
        socket.join(key);
        socket.join(data.project);
        if (data.channels) {
          _ref = data.channels.split(',');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            channel = _ref[_i];
            channel = S(channel).trim().s;
            _results.push(socket.join("" + data.project + ":channel:" + channel));
          }
          return _results;
        }
      });
      return socket.on('disconnect', function(_user) {
        var key, user;
        key = sessions[socket.id];
        user = users[key];
        delete sessions[socket.id];
        if (user) {
          user = _.without(user, socket.id);
        }
        if (!user || !user.length) {
          delete users[key];
          socket.broadcast.emit('remove_user', key);
          return pushOnlines(socket);
        }
      });
    });
  };

}).call(this);
