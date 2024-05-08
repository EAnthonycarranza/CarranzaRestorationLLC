import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import heic2any from 'heic2any';
import Modal from 'react-modal';

// Apply styles to the modal component
Modal.setAppElement('#root');

const ImageUploader = ({ onFilesAdded }) => {
  const [files, setFiles] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const convertHeicToPng = async (file) => {
    try {
      const blob = await heic2any({ blob: file, toType: 'image/png' });
      const pngFile = new File([blob], `${file.name}.png`, { type: 'image/png' });
      return pngFile;
    } catch (error) {
      console.error('HEIC to PNG conversion failed:', error);
      return file; // fallback to original HEIC file if conversion fails
    }
  };

  const onDrop = useCallback(async acceptedFiles => {
    const convertedFilesPromises = acceptedFiles.map(async file => {
      if (file.type === 'image/heic') {
        const pngFile = await convertHeicToPng(file);
        return {
          file: pngFile,
          preview: URL.createObjectURL(pngFile),
        };
      } else {
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      }
    });

    const newFiles = await Promise.all(convertedFilesPromises);
    const updatedFiles = [...files, ...newFiles].slice(0, 3);
    setFiles(updatedFiles);
    onFilesAdded(updatedFiles.map(f => f.file));
  }, [files, onFilesAdded]);

  const removeFile = fileIndex => {
    const updatedFiles = files.filter((_, index) => index !== fileIndex);
    setFiles(updatedFiles);
    onFilesAdded(updatedFiles.map(f => f.file));
  };

  const openPreview = (preview) => {
    setSelectedPreview(preview);
    setModalOpen(true);
  };

  const closePreview = () => {
    setModalOpen(false);
    setSelectedPreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <div {...getRootProps()} style={{
        border: '2px dashed #FD5D14',
        borderRadius: '5px',
        padding: '30px',
        backgroundColor: isDragActive ? '#e9f5ff' : '#f8f9fa',
        color: '#6c757d',
        marginBottom: '20px',
        cursor: 'pointer'
      }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here...</p>
        ) : (
          <p>Drag 'n' drop images here, or click to select files (up to 3)</p>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
        {files.map((fileObject, index) => (
          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={fileObject.preview}
              alt={`Preview ${index}`}
              style={{ width: '100px', height: '100px', cursor: 'pointer' }}
              onClick={() => openPreview(fileObject.preview)}
            />
            <button onClick={() => removeFile(index)} style={{
              position: 'absolute',
              top: 0,
              right: 0,
              borderRadius: '50%',
              border: 'none',
              width: '20px',
              height: '20px',
              backgroundColor: 'red',
              color: 'white',
              cursor: 'pointer'
            }}>
              X
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Full-Screen Preview */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closePreview}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
        }}
      >
        {selectedPreview && (
          <img src={selectedPreview} alt="Full Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        )}
        <button onClick={closePreview} style={{
          position: 'absolute',
          top: 10,
          right: 10,
          borderRadius: '50%',
          border: 'none',
          width: '25px',
          height:'25px',
          backgroundColor:'red',
          color:'white',
          cursor:'pointer',
        }}>X</button>
      </Modal>
    </div>
  );
};

export default ImageUploader;
