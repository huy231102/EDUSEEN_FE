import AWS from 'aws-sdk';

const S3_BUCKET = process.env.REACT_APP_AWS_S3_BUCKET;
const REGION = process.env.REACT_APP_AWS_REGION;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: REGION,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export function uploadFileToS3(file, folder = 'videos') {
  return new Promise((resolve, reject) => {
    const key = `${folder}/${Date.now()}_${file.name}`;
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: file.type,
    };

    myBucket
      .putObject(params)
      .send((err, data) => {
        if (err) {
          reject(err);
        } else {
          const url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
          resolve(url);
        }
      });
  });
} 