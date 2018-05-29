'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _amazon = require('./amazon');

var _amazon2 = _interopRequireDefault(_amazon);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _streamToArray = require('stream-to-array');

var _streamToArray2 = _interopRequireDefault(_streamToArray);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _mail2 = require('./mail');

var _mail3 = _interopRequireDefault(_mail2);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = {
  signS3: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
      var params, data;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return getS3Params();

            case 3:
              params = _context.sent;
              _context.next = 6;
              return getSignedUrl(params);

            case 6:
              data = _context.sent;
              
              res.json({
                signedRequest: data,
                url: 'https://' + process.env.S3_BUCKET + '.s3.amazonaws.com/' + params.Key
              });
              _context.next = 15;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context['catch'](0);

              console.log(_context.t0);
              res.status(500);
              res.json({ message: _context.t0.message });

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 10]]);
    }));

    function signS3(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return signS3;
  }(),
  mail: function mail(req, res) {
    var gif = _url2.default.parse(req.body.link);
    gif = gif.path.replace('/', '');
    console.log(gif);
    var mailparams = {
      from: 'Xappia',
      to: req.body.mail,
      subject: 'Tu GIF de Xappia!',
      template: 'gif',
      context: {
        gif: gif
      }
    };
    _mail3.default.sendMail(mailparams, function (err, info) {
      if (err) {
        console.log(err);
        res.status(500);
        res.json(err.message);
      }
      console.log('email sent');
      res.json(info);
    });
  },
  testmail: function testmail(req, res) {
    var mailparams = {
      from: 'Xappia',
      to: 'emmanuel.vazquez@xappia.com',
      subject: 'Tu GIF de Xappia!',
      template: 'gif',
      context: {
        gif: 'https://s3-us-west-2.amazonaws.com/xappia-demo/78cd091246a78f2b293c41db220919ac35021674.gif'
      }
    };
    _mail3.default.sendMail(mailparams, function (err, info) {
      if (err) {
        console.log(err);
        res.status(500);
        res.json(err.message);
      }
      console.log('email sent');
      res.json(info);
    });
  }
};

var getS3Params = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = process.env.S3_BUCKET;
            _context2.next = 3;
            return randomBytes(20);

          case 3:
            _context2.t1 = _context2.sent.toString('hex');
            _context2.t2 = _context2.t1 + '.gif';
            return _context2.abrupt('return', {
              Bucket: _context2.t0,
              Key: _context2.t2,
              Expires: 60,
              ContentEncoding: 'base64',
              ContentType: 'image/gif',
              ACL: 'public-read'
            });

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getS3Params() {
    return _ref2.apply(this, arguments);
  };
}();

var getSignedUrl = function getSignedUrl(params) {
  return new _promise2.default(function (resolve, reject) {
    _amazon2.default.getSignedUrl('putObject', params, function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
};

var randomBytes = function randomBytes(cantidad) {
  return new _promise2.default(function (fulfill, reject) {
    _crypto2.default.randomBytes(cantidad, function (error, buffer) {
      if (error) {
        reject(error);
      }
      fulfill(buffer);
    });
  });
};

var checkAccount = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id) {
    var cuenta;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return SF.sobject('Contact').select('Id').where({ Facebook_ID__c: id }).execute();

          case 3:
            cuenta = _context3.sent;
            return _context3.abrupt('return', cuenta.length ? true : false);

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 7]]);
  }));

  return function checkAccount(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var createPhoto = function createPhoto(photo, contactID) {
  return SF.sobject('FotoIA__c').create({
    Contacto__c: contactID,
    URL__c: photo.url,
    Comida__c: photo.classification.restaurant,
    Vacacion__c: photo.classification.vacation
  });
};

var setRekonitionID = function setRekonitionID(contactID, faceID) {
  return SF.sobject('Contact').update({
    Id: contactID,
    Rekognition_id__c: faceID
  });
};

var getContactByRekognition = function getContactByRekognition(rekognitionID) {
  return SF.sobject('Contact').select('Id').where({
    Rekognition_id__c: rekognitionID
  });
};

var getBufferFromURL = function getBufferFromURL(url) {
  return new _promise2.default(function (fulfill, reject) {
    _request2.default.defaults({ encoding: null }).get(url, function (err, res, body) {
      if (err) reject(err);
      fulfill(body);
    });
  });
};

var getAttachmentFile = function getAttachmentFile(attach) {
  return new _promise2.default(function (resolve, reject) {
    _request2.default.defaults({ encoding: null }).get('' + SF.instanceUrl + attach.Body, {
      'auth': {
        'bearer': SF.accessToken
      }
    }, function (err, res, body) {
      if (err) reject(err);
      resolve(body);
    });
  });
};

var addToIndex = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(photo) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', new _promise2.default(function () {
              var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(resolve, reject) {
                var params;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        params = {
                          CollectionId: "DEMO_XAPPIA",
                          Image: {
                            Bytes: photo || 'STRING_VALUE'
                          }
                        };

                        _amazon2.default.indexFaces(params, function (err, data) {
                          console.log(data);
                          if (err) reject(err);else resolve(data.FaceRecords.length ? data.FaceRecords[0].Face.FaceId : '');
                        });

                      case 2:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, undefined);
              }));

              return function (_x5, _x6) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function addToIndex(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var createContact = function createContact(firstName, lastName, id) {
  return SF.sobject('Contact').create({
    FirstName: firstName,
    LastName: lastName,
    Facebook_ID__c: id
  });
};

var getContacts = function getContacts() {
  return SF.sobject('Contact').select('Id, Rekognition_id__c').execute();
};

var getAttachment = function getAttachment(id) {
  return SF.sobject('Attachment').select('Id, Body').where({
    ParentId: id
  }).execute();
};

var detectLabels = function detectLabels(img) {
  return new _promise2.default(function (fulfill, reject) {
    var params = {
      Image: {
        Bytes: img
      }
    };
    _amazon2.default.detectLabels(params, function (err, data) {
      if (err) reject(err);
      fulfill(data);
    });
  });
};

var compareFaces = function compareFaces(face1, face2) {
  return new _promise2.default(function (fulfill, reject) {
    var params = {
      SimilarityThreshold: 90,
      SourceImage: {
        Bytes: face1
      },
      TargetImage: {
        Bytes: face2
      }
    };
    _amazon2.default.compareFaces(params, function (err, data) {
      if (err) reject(err);else fulfill(data);
    });
  });
};

var compareFaceCollection = function compareFaceCollection(photo) {
  return new _promise2.default(function (resolve, reject) {
    var params = {
      CollectionId: 'DEMO_XAPPIA', /* required */
      Image: { /* required */
        Bytes: photo
      }
    };
    _amazon2.default.searchFacesByImage(params, function (err, data) {
      if (err) reject(err);
      if (!data || !data.FaceMatches || !data.FaceMatches.length) reject('No coincide');else resolve(data.FaceMatches[0].Face.FaceId);
    });
  });
};

var classificate = function classificate(labels) {
  var category = {
    vacation: 0,
    restaurant: 0
  };

  labels.map(function (x) {
    for (var v = 0; v < VACATION_LABELS.length; v++) {
      if (x.Name === VACATION_LABELS[v]) {
        if (x.Confidence > category.vacation) {
          category.vacation = parseInt(x.Confidence);
        }
      }
    }

    for (var r = 0; r < RESTAURANT_LABELS.length; r++) {
      if (x.Name === RESTAURANT_LABELS[r]) {
        if (x.Confidence > category.restaurant) category.restaurant = parseInt(x.Confidence);
      }
    }
  });

  return category;
};

var createCollection = function createCollection() {
  return new _promise2.default(function (resolve, reject) {
    var params = {
      CollectionId: 'DEMO_XAPPIA'
    };
    _amazon2.default.createCollection(params, function (err, data) {
      if (err) {
        if (err.message.includes('already exists')) {
          resolve('OK');
        } else {
          reject(err);
        }
      } else resolve(data);
    });
  });
};

var decodeBase64Image = function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
};

exports.default = controller;