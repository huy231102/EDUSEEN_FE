import React, { useState, useRef, useCallback } from 'react';
import './style.css';

const ContentUpload = ({ onFilesChange, acceptedTypes = "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx", multiple = true }) => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOverAddMore, setIsDragOverAddMore] = useState(false);
  const fileInputRef = useRef(null);
  const addMoreInputRef = useRef(null);

  const handleFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setFiles(prev => {
      const updated = multiple ? [...prev, ...newFiles] : newFiles;
      if (onFilesChange) onFilesChange(updated.map(f => f.file));
      return updated;
    });
  }, [multiple, onFilesChange]);

  const handleFileInput = (e) => {
    const fileList = e.target.files;
    if (fileList.length > 0) {
      handleFiles(fileList);
    }
    // Reset input để có thể chọn lại file cũ
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const fileList = e.dataTransfer.files;
    if (fileList.length > 0) {
      handleFiles(fileList);
    }
  };

  const handleAddMoreDragOver = (e) => {
    e.preventDefault();
    setIsDragOverAddMore(true);
  };

  const handleAddMoreDragLeave = (e) => {
    e.preventDefault();
    setIsDragOverAddMore(false);
  };

  const handleAddMoreDrop = (e) => {
    e.preventDefault();
    setIsDragOverAddMore(false);
    const fileList = e.dataTransfer.files;
    if (fileList.length > 0) {
      handleFiles(fileList);
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== fileId);
      if (onFilesChange) {
        onFilesChange(updatedFiles.map(f => f.file));
      }
      return updatedFiles;
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return 'fa fa-image';
    if (fileType.startsWith('video/')) return 'fa fa-video';
    if (fileType.includes('pdf')) return 'fa fa-file-pdf';
    if (fileType.includes('doc')) return 'fa fa-file-word';
    if (fileType.includes('xls')) return 'fa fa-file-excel';
    return 'fa fa-file';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="content-upload-container">
      {files.length === 0 && (
        <div 
          className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">
            <i className="fa fa-cloud-upload-alt"></i>
          </div>
          <div className="upload-text">
            <span className="upload-title">Thêm hoặc tạo file</span>
            <small className="upload-subtitle">
              Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, hình ảnh, video
            </small>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes}
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {files.length > 0 && (
        <div className="files-container">
          {files.map((fileItem) => (
            <div key={fileItem.id} className="file-item">
              <div className="file-thumbnail">
                {fileItem.preview ? (
                  <img src={fileItem.preview} alt={fileItem.file.name} />
                ) : (
                  <i className={getFileIcon(fileItem.file.type)}></i>
                )}
              </div>
              <div className="file-info">
                <span className="file-name">{fileItem.file.name}</span>
                <span className="file-size">{formatFileSize(fileItem.file.size)}</span>
              </div>
              <button 
                className="remove-file-btn"
                onClick={() => removeFile(fileItem.id)}
                type="button"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          ))}
          
          {multiple && (
            <div 
              className={`add-more-files ${isDragOverAddMore ? 'drag-over' : ''}`}
              onClick={() => addMoreInputRef.current?.click()}
              onDragOver={handleAddMoreDragOver}
              onDragLeave={handleAddMoreDragLeave}
              onDrop={handleAddMoreDrop}
            >
              <i className="fa fa-plus"></i>
              <span>Thêm file khác</span>
              <input
                ref={addMoreInputRef}
                type="file"
                multiple={multiple}
                accept={acceptedTypes}
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentUpload; 