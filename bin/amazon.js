import AMAZON from 'aws-sdk';

AMAZON.config.update({
    accessKeyId: "AKIAINJUKIG4HGGK7B6A",
    secretAccessKey: "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",
    "region": "us-east-1"
});
const AWS = new AMAZON.S3();

export default AWS;