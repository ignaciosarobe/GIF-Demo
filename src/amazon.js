import AMAZON from 'aws-sdk';

AMAZON.config.update({
    accessKeyId: "AKIAJ6KCD3U6IG2X3YGQ",
    secretAccessKey: "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",
    "region": "us-east-1"
});
const AWS = new AMAZON.S3();

export default AWS;