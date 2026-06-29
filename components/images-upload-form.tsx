"use client";
import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@/i18n/routing";
import { useImageUpload } from "@/hooks/use-image-upload";

// Labels interface

export interface ImagesUploadLabels {
  noImages: string;
  dragActive: string;
  selectFiles: string;
  selectedFileName: string;
  selectedFileSize: string;
  selectedFileDimensions: string;
  uploading: string;
  upload: string;
  remove: string;
  fileRejectionTitle: string;
  fileRejectionName: (name: string) => React.ReactNode;
  done: string;
}

interface ExistingImage {
  id: string;
  url: string;
  displayOrder?: number;
}

interface ImagesUploadFormProps {
  currentImages?: ExistingImage[];
  altText: string;
  fieldName: string;
  onUpload: (formData: FormData) => Promise<any>;
  isPendingUpload: boolean;
  doneHref: string;
  maxSize?: number;
  maxFiles: number;
  maxImageSize?: number;
  labels: ImagesUploadLabels;
}

const ImagesUploadForm: React.FC<ImagesUploadFormProps> = ({
  currentImages = [],
  altText,
  fieldName,
  onUpload,
  isPendingUpload,
  doneHref,
  maxSize = 5 * 1024 * 1024,
  maxFiles,
  maxImageSize = 300,
  labels,
}) => {
  const {
    files,
    fileRejections,
    isDragActive,
    getRootProps,
    getInputProps,
    clearFiles,
  } = useImageUpload({
    maxSize,
    maxFiles,
    disabled: isPendingUpload,
  });

  const [showRejectFileWarn, setShowRejectFileWarn] = useState(true);

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
      {/* Existing images */}
      <Row className="mb-4">
        <Col>
          {currentImages.length > 0 ? (
            <div className="d-flex flex-wrap gap-3">
              {currentImages.map(image => (
                <Card key={image.id} style={{ width: maxImageSize }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={altText}
                    style={{
                      width: "100%",
                      height: maxImageSize,
                      objectFit: "contain",
                      borderTopLeftRadius: "var(--bs-card-inner-border-radius)",
                      borderTopRightRadius: "var(--bs-card-inner-border-radius)",
                    }}
                  />
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted">{labels.noImages}</p>
          )}
        </Col>
      </Row>

      {/* Dropzone */}
      <Row className="mb-3">
        <Col>
          <div
            {...getRootProps({
              className:
                "form-control d-flex flex-column align-items-center justify-content-center",
            })}
            style={{
              minHeight: 120,
              cursor: isPendingUpload ? "not-allowed" : "pointer",
              padding: "2rem",
            }}
          >
            <input {...getInputProps()} />

            {isDragActive ? (
              <p className="mb-0">{labels.dragActive}</p>
            ) : (
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-images" style={{ fontSize: "3rem" }} aria-hidden="true" />
                <p className="text-center mb-0">{labels.selectFiles}</p>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Selected images preview */}
      {files.length > 0 && (
        <>
          <Row className="mb-3">
            <Col>
              <div className="d-flex flex-wrap gap-3">
                {files.map(file => (
                  <Card key={`${file.name}-${file.size}`} style={{ width: maxImageSize }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.preview}
                      alt={file.name}
                      style={{
                        width: "100%",
                        height: maxImageSize,
                        objectFit: "contain",
                        borderTopLeftRadius: "var(--bs-card-inner-border-radius)",
                        borderTopRightRadius: "var(--bs-card-inner-border-radius)",
                      }}
                    />

                    <Card.Body className="small text-muted">
                      <div>
                        <strong>{labels.selectedFileName}:</strong> {file.name}
                      </div>
                      <div>
                        <strong>{labels.selectedFileSize}:</strong> {file.formattedSize}
                      </div>

                      {file.width && file.height && (
                        <div>
                          <strong>{labels.selectedFileDimensions}:</strong>{" "}
                          {file.width} × {file.height}px
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={isPendingUpload}
                className="me-2"
              >
                {isPendingUpload ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} className="me-1" spin />{" "}
                    {labels.uploading}
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
                disabled={isPendingUpload}
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
            <Alert
              variant="danger"
              show={showRejectFileWarn}
              onClose={() => setShowRejectFileWarn(false)}
              dismissible
            >
              <Alert.Heading className="mb-3">
                <i className="bi bi-exclamation-circle" /> {labels.fileRejectionTitle}
              </Alert.Heading>

              <div className="d-flex flex-column gap-3">
                {fileRejections.map(({ file, errors }) => (
                  <div key={`${file.name}-${file.size}`}>
                    <p className="mb-0">{labels.fileRejectionName(file.name)}</p>

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
            <Button variant="success">{labels.done}</Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default ImagesUploadForm;