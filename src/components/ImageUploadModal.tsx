/**
 * Image Upload Modal Component
 * Allows users to upload images via URL or from their computer
 */

import React, { useState, useRef, ChangeEvent } from 'react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (imageUrl: string) => void;
  currentImageUrl?: string;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onImageSelected,
  currentImageUrl,
}: ImageUploadModalProps): JSX.Element | null {
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsLoading(true);

    // Convert file to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setIsLoading(false);
      onImageSelected(dataUrl);
      onClose();
    };
    reader.onerror = () => {
      setIsLoading(false);
      alert('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
      onImageSelected(imageUrl);
      onClose();
    } catch {
      alert('Please enter a valid URL');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-upload-modal-overlay" onClick={handleOverlayClick}>
      <div className="image-upload-modal">
        <div className="image-upload-modal-header">
          <h2>Upload Image</h2>
          <button
            className="image-upload-modal-close"
            onClick={onClose}
            aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="image-upload-modal-content">
          {/* Upload Method Tabs */}
          <div className="image-upload-tabs">
            <button
              className={`image-upload-tab ${uploadMethod === 'url' ? 'active' : ''}`}
              onClick={() => setUploadMethod('url')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>URL</span>
            </button>
            <button
              className={`image-upload-tab ${uploadMethod === 'file' ? 'active' : ''}`}
              onClick={() => setUploadMethod('file')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Upload</span>
            </button>
          </div>

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <div className="image-upload-section">
              <label htmlFor="image-url-input">Image URL</label>
              <input
                id="image-url-input"
                type="url"
                className="image-upload-input"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit();
                  }
                }}
              />
              <button
                className="image-upload-button primary"
                onClick={handleUrlSubmit}>
                Insert Image
              </button>
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <div className="image-upload-section">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              
              <div
                className="image-upload-dropzone"
                onClick={() => fileInputRef.current?.click()}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="dropzone-text">
                  {isLoading ? 'Loading...' : 'Click to select an image'}
                </p>
                <p className="dropzone-hint">
                  JPG, PNG, GIF up to 5MB
                </p>
              </div>

              <button
                className="image-upload-button secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Choose File'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

