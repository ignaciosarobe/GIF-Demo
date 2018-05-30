"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({
    accessKeyId: "AKIAJ6KCD3U6IG2X3YGQ",
    secretAccessKey: "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",
    "region": "us-east-1"
});
var AWS = new _awsSdk2.default.S3();

exports.default = AWS;