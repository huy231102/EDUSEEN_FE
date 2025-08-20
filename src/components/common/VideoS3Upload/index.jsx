import React, { useState } from 'react';
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

const VideoS3Upload = ({ onUploaded, defaultUrl }) => {
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(defaultUrl || '');

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const key = `videos/${Date.now()}_${file.name}`;
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: file.type,
    };

    myBucket
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err, data) => {
        if (err) {
          alert('Upload lỗi: ' + err.message);
        } else {
          const url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
          setVideoUrl(url);
          if (onUploaded) onUploaded(url);
        }
      });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileInput}
          style={{ flexGrow: 0, width: 300, marginBottom: 0 }}
        />
        {videoUrl && (
          <video src={videoUrl} controls width="620" />
        )}
      </div>
      {progress > 0 && progress < 100 && (
        <div style={{ marginTop: 8 }}>Đang upload: {progress}%</div>
      )}
    </div>
  );
};

export default VideoS3Upload; 