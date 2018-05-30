'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var upload = (0, _multer2.default)();
var router = _express2.default.Router();

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/gif/:id', function (req, res, next) {
  res.locals.gif = req.params.id;
  res.render('gif');
});

router.get('/test', _controller2.default.testmail);

router.get('/api/sign-s3', _controller2.default.signS3);
router.post('/api/email', _controller2.default.mail);

exports.default = router;