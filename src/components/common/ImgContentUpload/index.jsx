import React, { useState, useEffect, useRef } from 'react';
import AWS from 'aws-sdk';
import { Button, LinearProgress, Box, Typography, Avatar } from '@material-ui/core';
import { CloudUpload, Delete } from '@material-ui/icons';
import './style.css';

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

const ImgContentUpload = ({ onUploaded, defaultUrl, label = "Ảnh đại diện", className = "" }) => {
  const [progress, setProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState(defaultUrl || '');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (defaultUrl) {
      setImgUrl(defaultUrl);
    }
  }, [defaultUrl]);

  const handleFileInput = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    // Kiểm tra định dạng file
    if (!f.type.startsWith('image/')) {
      alert('Chỉ hỗ trợ file ảnh!');
      return;
    }
    
    // Kiểm tra kích thước file (5MB)
    if (f.size > 5 * 1024 * 1024) {
      alert('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
      return;
    }
    
    setFile(f);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    setProgress(0);

    const key = `avatars/${Date.now()}_${file.name}`;
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
        setIsUploading(false);
        if (err) {
          console.error('Upload error:', err);
          alert('Upload lỗi: ' + err.message);
          setProgress(0);
        } else {
          const url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
          setImgUrl(url);
          setFile(null);
          setProgress(0);
          if (onUploaded) onUploaded(url);
        }
      });
  };

  const handleRemoveImage = () => {
    setImgUrl('');
    setFile(null);
    if (onUploaded) onUploaded('');
  };

  return (
    <div className={`img-content-upload-container ${className}`}>
      <div className="img-content-upload-left">
        <Typography variant="subtitle1" className="img-content-upload-label">
          {label}
        </Typography>
        
        {/* File Input */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileInput}
          className="img-content-upload-input"
        />
        
        {/* Upload Button */}
        <Button
          variant="outlined"
          startIcon={<CloudUpload />}
          className="img-content-upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          Chọn ảnh
        </Button> 
      </div>

      {/* File Info and Upload Button */}
      <div className="img-content-upload-right">
        {file && (
          <div className="img-content-upload-file-info">
            <Typography variant="body2" className="img-content-upload-file-name">
              {file.name}
            </Typography>
            <Button
              variant="contained"
              onClick={handleUpload}
              className="img-content-upload-upload-btn"
              disabled={isUploading}
            >
              {isUploading ? 'Đang upload...' : 'Upload lên cloud'}
            </Button>
          </div>
        )}

        {/* Progress Bar */}
        {progress > 0 && progress < 100 && (
          <div className="img-content-upload-progress">
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              className="img-content-upload-progress-bar"
            />
            <Typography variant="caption" className="img-content-upload-progress-text">
              {progress}% hoàn thành
            </Typography>
          </div>
        )}

        {/* Image Preview */}
        {imgUrl && (
          <div className="img-content-upload-preview">
            <div className="img-content-upload-preview-header">
              <Typography variant="subtitle2" className="img-content-upload-preview-title">
                Ảnh đã upload:
              </Typography>
              <Button
                size="small"
                onClick={handleRemoveImage}
                startIcon={<Delete />}
                className="img-content-upload-delete-btn"
              >
                Xóa
              </Button>
            </div>
            <Avatar
              src={imgUrl}
              variant="rounded"
              className="img-content-upload-avatar"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImgContentUpload; 