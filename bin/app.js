'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _herokuSslRedirect = require('heroku-ssl-redirect');

var _herokuSslRedirect2 = _interopRequireDefault(_herokuSslRedirect);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _amazon = require('./amazon');

var _amazon2 = _interopRequireDefault(_amazon);

var _mail = require('./mail');

var _mail2 = _interopRequireDefault(_mail);

var _handlebars = require('./handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// Views init
app.set('views', _path2.default.join(__dirname, '../views'));
app.set('view engine', 'hbs');
// Static files path
app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));
// Favicon set
app.use((0, _serveFavicon2.default)(_path2.default.join(__dirname, '../public', 'favicon.ico')));

// Asignamos el logger
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _herokuSslRedirect2.default)());

app.use((0, _helmet2.default)({
  frameguard: {
    action: 'sameorigin'
  },
  hsts: {
    maxAge: 10886400,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: {
    policy: 'same-origin'
  }
}));

// Middleware para pasar datos a las views
app.use(function (req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
  next();
});

app.use('/', _routes2.default);

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.status(404);
  res.json({ message: 'Resource not found' });
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.PORT || 3000;

app.set('port', port);

var server = app.listen(port, function () {
  console.log('XAPPIA MAGIC HAPPENS AT: ' + server.address().port);
});