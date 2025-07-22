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

const ImageS3Upload = ({ onUploaded, defaultUrl }) => {
  const [progress, setProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState(defaultUrl || '');
  const [file, setFile] = useState(null);

  const handleFileInput = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      alert('Chỉ hỗ trợ file ảnh!');
      return;
    }
    setFile(f);
  };

  const handleUpload = () => {
    if (!file) return;
    const key = `covers/${Date.now()}_${file.name}`;
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
          setImgUrl(url);
          setFile(null);
          setProgress(0);
          if (onUploaded) onUploaded(url);
        }
      });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileInput} />
      {file && (
        <div style={{marginTop: 8}}>
          <span>{file.name}</span>
          <button type="button" className="btn primary" onClick={handleUpload} style={{marginLeft: 8}}>Upload</button>
        </div>
      )}
      {progress > 0 && progress < 100 && <div>Đang upload: {progress}%</div>}
      {imgUrl && (
        <img src={imgUrl} alt="cover" style={{maxWidth: 300, marginTop: 8, borderRadius: 8}} />
      )}
    </div>
  );
};

export default ImageS3Upload; 