(function() {
  var subscribe;

  subscribe = function(req, res) {
    return res.send('subscribe');
  };

  module.exports = function(app) {
    return app.get('/sub', subscribe);
  };

}).call(this);
