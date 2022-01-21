// Node Imports
import AWS = require('aws-sdk');
// Own Imports
import config from "./config";

// Constants
const AWS_CONFIG = config.AWS;
const EXPIRE_URL = 60 * 5

// Configure AWS
if (AWS_CONFIG.AWS_PROFILE !== 'DEPLOYED') {
    let credentials = new AWS.SharedIniFileCredentials({profile: AWS_CONFIG.AWS_PROFILE});
    AWS.config.credentials = credentials;
}

// S3 Object to interact with AWS Buckets
export const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: AWS_CONFIG.AWS_REGION,
    params: {Bucket: AWS_CONFIG.AWS_MEDIA_BUCKET}
});

/**
 * getGetSignedUrl generates an aws signed url to retreive an item
 * @param key: string - the filename to be retreived from s3 bucket
 * @returns a signed-url as a string
 */
export function getGetSignedUrl( key: string ): string{
    
    return s3.getSignedUrl('getObject', {
        Bucket: AWS_CONFIG.AWS_MEDIA_BUCKET,
        Key: key,
        Expires: EXPIRE_URL
    });
    
}

/**
 * getPutSignedUrl generates an aws signed url to put an item
 * @param key: string - the filename to be put into the s3 bucket
 * @returns a signed-url as a string
 */
export function getPutSignedUrl( key: string ){
    
    return s3.getSignedUrl('putObject', {
        Bucket: AWS_CONFIG.AWS_MEDIA_BUCKET,
        Key: key,
        Expires: EXPIRE_URL
    });
}
