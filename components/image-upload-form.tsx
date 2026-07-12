"use client";
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@/i18n/routing';
import { useImageUpload } from '@/hooks/use-image-upload';

// Labels interface

export interface ImageUploadLabels {
  noImage:            string;
  deleteImage:        string;
  deleting:           string;
  dragActive:         string;
  selectFile:         string;
  selectedFileName:       string;
  selectedFileSize:       string;
  selectedFileDimensions: string;
  uploading:          string;
  upload:             string;
  remove:             string;
  fileRejectionTitle: string;
  fileRejectionName:  (name: string) => React.ReactNode;
  done:               string;
}

// Props

interface ImageUploadFormProps {
  currentImageUrl?:  string;
  altText:           string;
  fieldName:         string;
  onUpload:          (formData: FormData) => Promise<any>;
  onDelete:          () => Promise<any>;
  isPendingUpload:   boolean;
  isPendingDelete:   boolean;
  doneHref:          string;
  maxSize?:          number;
  accept:            string[];
  maxImageSize?:     number;  // max width or height in px, default 300
  labels:            ImageUploadLabels;
}

// Component

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  currentImageUrl,
  altText,
  fieldName,
  onUpload,
  onDelete,
  isPendingUpload,
  isPendingDelete,
  doneHref,
  maxSize = 5 * 1024 * 1024,
  accept,
  maxImageSize = 300,
  labels,
}) => {

  const { files, fileRejections, isDragActive, getRootProps, getInputProps, clearFiles } = useImageUpload({
    maxSize,
    accept,
    disabled: isPendingUpload || isPendingDelete,
  });

  const [showRejectFileWarn, setShowRejectFileWarn] = useState(true);

  // Reset alert visibility whenever new rejections arrive
  useEffect(() => {
    if (fileRejections.length > 0) {
      setShowRejectFileWarn(true);
    }
  }, [fileRejections]);

  const handleUpload = async () => {
    if (!files.length) return;
    const formData = new FormData();

    files.forEach(file => {
      formData.append(fieldName, file);
    });

    await onUpload(formData);
    clearFiles();
  };

  return (
    <div>

      {/* Current image */}
      <Row className="mb-4">
        <Col>
          {currentImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImageUrl}
                alt={altText}
                style={{
                  maxWidth:     maxImageSize,
                  maxHeight:    maxImageSize,
                  width:        'auto',
                  height:       'auto',
                  borderRadius: 'var(--bs-border-radius)',
                  display:      'block',
                }}
              />

              <div className="mt-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onDelete}
                  disabled={isPendingDelete || isPendingUpload}
                >
                  {isPendingDelete ? (
                    <>
                      <FontAwesomeIcon icon={faCircleNotch} className="me-1" spin /> {labels.deleting}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrash} className="me-1" /> {labels.deleteImage}
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted">{labels.noImage}</p>
          )}
        </Col>
      </Row>

      {/* Dropzone */}
      <Row className="mb-3">
        <Col>
          <div
            {...getRootProps({
              className: 'form-control d-flex flex-column align-items-center justify-content-center'
            })}
            style={{ minHeight: 120, cursor: isPendingUpload || isPendingDelete ? 'not-allowed' : 'pointer', padding: '2rem' }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="mb-0">{labels.dragActive}</p>
            ) : (
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-image" style={{ fontSize: '3rem' }} aria-hidden="true" />
                <p className="text-center mb-0">{labels.selectFile}</p>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Preview + upload actions */}
      {files.length > 0 && (
        <>
          <Row className="mb-3">
            <Col>
              {files.map(file => (
                <div key={file.name} className="mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.preview}
                    alt={file.name}
                    style={{
                      maxWidth: maxImageSize,
                      maxHeight: maxImageSize,
                      width: "auto",
                      height: "auto",
                      borderRadius: "var(--bs-border-radius)",
                      display: "block",
                    }}
                  />

                  <div className="small text-muted mt-2">
                    <div><strong>{labels.selectedFileName}:</strong> {file.name}</div>
                    <div><strong>{labels.selectedFileSize}:</strong> {file.formattedSize}</div>

                    {file.width && file.height && (
                      <div>
                        <strong>{labels.selectedFileDimensions}:</strong> {file.width} × {file.height}px
                      </div>
                    )}
                  </div>
                </div>
              ))}

            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={isPendingUpload || isPendingDelete}
                className="me-2"
              >
                {isPendingUpload ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} className="me-1" spin /> {labels.uploading}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} className="me-1" /> {labels.upload}
                  </>
                )}
              </Button>
              <Button
                variant="danger"
                onClick={clearFiles}
                disabled={isPendingUpload || isPendingDelete}
              >
                <FontAwesomeIcon icon={faTrash} className="me-1" /> {labels.remove}
              </Button>
            </Col>
          </Row>
        </>
      )}

      {/* File rejections */}
      {fileRejections.length > 0 && (
      <Row className="mb-3">
        <Col>
          <Alert variant="danger" show={showRejectFileWarn} onClose={() => setShowRejectFileWarn(false)} dismissible>
            <Alert.Heading className='mb-3'>
              <i className="bi bi-exclamation-circle"></i> {labels.fileRejectionTitle}
            </Alert.Heading>

            <div className='d-flex flex-column gap-3'>
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name} className="mb-0">
                <p className='mb-0'>{labels.fileRejectionName(file.name)}</p>
                <ul className="mb-0 mt-1">
                  {errors.map(error => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
            ))}
            </div>
          </Alert>
        </Col>
      </Row>
    )}

      {/* Done button */}
      <Row>
        <Col className="d-flex justify-content-end">
          <Link href={doneHref}>
            <Button variant="success">
              {labels.done}
            </Button>
          </Link>
        </Col>
      </Row>

    </div>
  );
};

export default ImageUploadForm;