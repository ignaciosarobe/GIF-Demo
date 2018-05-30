"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({
    accessKeyId: "AKIAINJUKIG4HGGK7B6A",
    secretAccessKey: "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",
    "region": "us-east-1"
});
var AWS = new _awsSdk2.default.S3();

exports.default = AWS;