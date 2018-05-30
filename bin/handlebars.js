'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hbs = require('hbs');

var _hbs2 = _interopRequireDefault(_hbs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Registramos los partials */

/* Registramos los helpers */
_hbs2.default.registerHelper('random', function () {
  return Math.floor(Math.random() * 99999 + 1);
});
_hbs2.default.registerHelper('incremented', function (index) {
  return ++index;
});

_hbs2.default.registerHelper('multiply', function (index, number) {
  return ++index * number;
});

_hbs2.default.registerHelper('for', function (n, block) {
  var finalblock = '';
  for (var i = 0; i < n; ++i) {
    finalblock += block.fn(i);
  }return finalblock;
});

_hbs2.default.registerHelper('upperCase', function (text) {
  return text.toUpperCase();
});

_hbs2.default.registerHelper('date-format-dmy', function (date) {
  return moment(date).utcOffset(0).format('DD-MM-YYYY');
});

_hbs2.default.registerHelper('date-format-dmyhms', function (date) {
  return moment(date).utcOffset(0).format('DD-MM-YYYY [a las] h:mm:ss a');
});

_hbs2.default.registerHelper('desde', function (inicio) {
  var now = moment();
  var inicioInscripcion = moment(inicio);
  return now.isSameOrAfter(inicioInscripcion);
});

_hbs2.default.registerHelper('hasta', function (fin) {
  var now = moment();
  var finInscripcion = moment(fin);
  return now.isSameOrBefore(finInscripcion);
});

_hbs2.default.registerHelper('isFinished', function (fecha) {
  var now = moment();
  fecha = moment(fecha);
  return now.isSameOrAfter(fecha);
});

_hbs2.default.registerHelper('displayName', function (name, lastname) {
  var nombre = name.split(' ')[0];
  var apellido = lastname.split(' ');

  return nombre + ' ' + apellido[0] + ' ' + (apellido[1] ? apellido[1] : '');
});

_hbs2.default.registerHelper('fill', function (text) {
  return text || '---';
});

_hbs2.default.registerHelper('cumplida', function (etapa) {
  return etapa === 'Cumplida';
});

exports.default = _hbs2.default;


function addPartial(dir, name) {
  try {
    _hbs2.default.registerPartial(name, _fs2.default.readFileSync(_path2.default.join(__dirname, '../views/' + dir + '/' + name + '.hbs'), 'utf-8'));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}