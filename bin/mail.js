'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _nodemailerExpressHandlebars = require('nodemailer-express-handlebars');

var _nodemailerExpressHandlebars2 = _interopRequireDefault(_nodemailerExpressHandlebars);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mailer = _nodemailer2.default.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: 'xappiamaid@gmail.com',
    pass: 'zseqsc321'
  }
});

var options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: _path2.default.join(__dirname, '../views/mail'),
    defaultLayout: 'template',
    partialsDir: _path2.default.join(__dirname, '../views/mail')
  },
  viewPath: _path2.default.join(__dirname, '../views/mail'),
  extName: '.hbs'
};

mailer.use('compile', (0, _nodemailerExpressHandlebars2.default)(options));

mailer.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

exports.default = mailer;