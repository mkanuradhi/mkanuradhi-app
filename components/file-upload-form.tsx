"use client";
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@/i18n/routing';
import { useFileUpload } from '@/hooks/use-file-upload';
import { getFileIconClass, getFileKind, getFileKindFromUrl } from '@/utils/mime-types';

// Labels interface

export interface FileUploadLabels {
  noFile:             string;
  deleteFile:         string;
  deleting:           string;
  dragActive:         string;
  selectFile:         string;
  selectedFileName:   string;
  selectedFileSize:   string;
  uploading:          string;
  upload:             string;
  remove:             string;
  fileRejectionTitle: string;
  fileRejectionName:  (name: string) => React.ReactNode;
  done:               string;
}

// Props

interface FileUploadFormProps {
  currentFileUrl?: string;
  altText:         string;
  fieldName:       string;
  onUpload:        (formData: FormData) => Promise<any>;
  onDelete:        () => Promise<any>;
  isPendingUpload: boolean;
  isPendingDelete: boolean;
  doneHref:        string;
  maxSize?:        number;
  accept?:         string[];
  labels:          FileUploadLabels;
}

// Component

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  currentFileUrl,
  altText,
  fieldName,
  onUpload,
  onDelete,
  isPendingUpload,
  isPendingDelete,
  doneHref,
  maxSize = 5 * 1024 * 1024,
  accept,
  labels,
}) => {

  const { files, fileRejections, isDragActive, getRootProps, getInputProps, clearFiles } = useFileUpload({
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

  // Resolve current file's kind from its URL (no MIME type available from backend yet)
  const currentFileKind = currentFileUrl ? getFileKindFromUrl(currentFileUrl) : null;

  return (
    <div>

      {/* Current file */}
      <Row className="mb-4">
        <Col>
          {currentFileUrl ? (
            <>
              {currentFileKind === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentFileUrl}
                  alt={altText}
                  style={{
                    width:        'auto',
                    height:       'auto',
                    borderRadius: 'var(--bs-border-radius)',
                    display:      'block',
                  }}
                />
              ) : (
                <Row>
                  <Col xs={12} sm={2} className="d-flex align-items-center justify-content-center mb-2">
                    <i
                      className={`bi ${getFileIconClass(currentFileKind!)}`}
                      style={{ fontSize: '3rem' }}
                      aria-hidden="true"
                    />
                  </Col>
                  <Col className="d-flex align-items-center">
                    <small className="text-muted">{currentFileUrl}</small>
                  </Col>
                </Row>
              )}
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
                      <FontAwesomeIcon icon={faTrash} className="me-1" /> {labels.deleteFile}
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted">{labels.noFile}</p>
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
                <i className="bi bi-file-earmark-plus" style={{ fontSize: '3rem' }} aria-hidden="true" />
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
              {files.map(file => {
                const kind = getFileKind(file.type);
                return (
                <div key={file.name} className="mb-3">
                  {kind === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.preview}
                      alt={file.name}
                      style={{
                        width: "auto",
                        height: "auto",
                        borderRadius: "var(--bs-border-radius)",
                        display: "block",
                      }}
                    />
                  ) : (
                    <i
                      className={`bi ${getFileIconClass(kind)}`}
                      style={{ fontSize: '3rem' }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="small text-muted mt-2">
                    <div><strong>{labels.selectedFileName}:</strong> {file.name}</div>
                    <div><strong>{labels.selectedFileSize}:</strong> {file.formattedSize}</div>
                  </div>
                </div>
              );
          })}

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

export default FileUploadForm;