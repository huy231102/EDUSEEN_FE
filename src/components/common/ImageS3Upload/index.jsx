import React, { useState, useEffect, useRef } from 'react';
import AWS from 'aws-sdk';
import { Button, LinearProgress, Box, Typography, Avatar } from '@material-ui/core';
import { CloudUpload, Delete } from '@material-ui/icons';

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
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (defaultUrl) {
      setImgUrl(defaultUrl);
    }
    console.log('ImageS3Upload mounted');
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
    console.log('File selected:', f.name, f.size, f.type);
  };

  const handleUpload = () => {
    if (!file) return;
    
    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
      return;
    }

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

    return (
    <Box>
      {/* File Input */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
      
      {/* Simple Button Approach */}
      <Button
        variant="outlined"
        startIcon={<CloudUpload />}
        style={{ 
          borderColor: '#1eb2a6', 
          color: '#1eb2a6',
          marginBottom: 8
        }}
        onClick={() => {
          console.log('Button clicked');
          if (fileInputRef.current) {
            fileInputRef.current.click();
            console.log('Input clicked via ref');
          } else {
            console.error('Input ref not found!');
            // Fallback: try to find any file input in the component
            const inputs = document.querySelectorAll('input[type="file"]');
            console.log('Found file inputs:', inputs.length);
            if (inputs.length > 0) {
              inputs[0].click();
              console.log('Clicked first available file input');
            }
          }
        }}
      >
        Chọn ảnh
      </Button>

          {/* File Info and Upload Button */}
      {file && (
        <Box mt={1} mb={1}>
          <Typography variant="body2" color="textSecondary">
            {file.name}
          </Typography>
          <Button
            variant="contained"
            onClick={handleUpload}
            style={{ 
              backgroundColor: '#1eb2a6', 
              color: 'white',
              marginTop: 4
            }}
            disabled={progress > 0}
          >
            {progress > 0 ? 'Đang upload...' : 'Upload lên cloud'}
          </Button>
        </Box>
      )}

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <Box mt={1}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            style={{ backgroundColor: '#e0e0e0' }}
          />
          <Typography variant="caption" color="textSecondary">
            {progress}% hoàn thành
          </Typography>
        </Box>
      )}

      {/* Image Preview */}
      {imgUrl && (
        <Box mt={2} className="category-upload-preview">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" color="primary">
              Ảnh đã upload:
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setImgUrl('');
                setFile(null);
                if (onUploaded) onUploaded('');
              }}
              startIcon={<Delete />}
              style={{ color: '#f44336' }}
            >
              Xóa
            </Button>
          </Box>
          <Avatar
            src={imgUrl}
            variant="rounded"
            style={{ 
              width: '100%', 
              height: 120, 
              marginTop: 8,
              objectFit: 'cover'
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ImageS3Upload; 