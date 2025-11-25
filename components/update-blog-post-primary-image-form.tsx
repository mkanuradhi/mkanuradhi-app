import BlogPost from '@/interfaces/i-blog-post';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faPaperPlane, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { useBlogPostByIdQuery, useUploadBlogPostPrimaryImageMutation } from '@/hooks/use-blog-posts';
import LoadingContainer from './loading-container';
import { Link } from '@/i18n/routing';
import "./update-blog-post-primary-image-form.scss";

const baseTPath = 'components.UpdateBlogPostPrimaryImageForm';

interface UpdateBlogPostPrimaryImageFormProps {
  id: string;
  onSuccess: (blogPost: BlogPost) => void;
}

interface PreviewFile {
  file: File;
  preview: string;
  dimensions?: { width: number; height: number };
}

const UpdateBlogPostPrimaryImageForm: React.FC<UpdateBlogPostPrimaryImageFormProps> = ({ id, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const { data: blogPost, isPending, isError, isFetching, isSuccess, error } = useBlogPostByIdQuery(id);
  const { mutateAsync: uploadBlogPostPrimaryImageMutation, isPending: isPendingUploadPrimaryImage } = useUploadBlogPostPrimaryImageMutation();

  const onDrop = useCallback( (acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const filesWithPreview: PreviewFile[] = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      // Load image to get dimensions
      filesWithPreview.forEach(previewFile => {
        const img = new window.Image();
        img.onload = () => {
          previewFile.dimensions = { width: img.width, height: img.height };
          setFiles([...filesWithPreview]); // Re-render with dimensions
        };
        img.src = previewFile.preview;
      });

      setFiles(filesWithPreview);

    }
  }, [])

  const {getRootProps, getInputProps, fileRejections, isDragActive} = useDropzone({
    accept: { 
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: isPendingUploadPrimaryImage,
    onDrop
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getOrientation = (width: number, height: number): string => {
    if (width === height) return t('square');
    return width > height ? t('landscape') : t('portrait');
  };

  const getAspectRatio = (width: number, height: number): string => {
    // Decimal ratio
    const decimalRatio = (width / height).toFixed(2);
    
    // Simplified ratio using GCD
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    const simplifiedRatio = `${width / divisor}:${height / divisor}`;
    
    return `${decimalRatio}:1 (${simplifiedRatio})`;
  };

  const handleUpload = () => {
    if (!files.length) return;
    
    const formData = new FormData();
    formData.append('primaryImage', files[0].file);

    uploadBlogPostPrimaryImageMutation(
      { id, formData },
      {
        onSuccess: (updatedBlogPost) => {
          onSuccess(updatedBlogPost);
          setFiles([]); // Clear uploaded file after success
        },
      }
    );
  }

  return (
    <>
      {isError && (
        <Row>
          <Col>{ error.message }</Col>
        </Row>
      )}
      {isPending || isFetching && (
        <LoadingContainer />
      )}
      {isSuccess && blogPost && (
      <div className="update-blog-post-primary-image-form">
        {/* display existing image */}
        <Row>
          <Col>
            {blogPost.primaryImage ? (
              <div className="primary-image-wrapper">
                <Image
                  src={blogPost.primaryImage}
                  alt={blogPost.titleEn}
                  fill={true}
                  className="primary-image"
                  priority={true}
                />
              </div>
            ) : (
              <div>
                <p>{t('noPrimaryImage')}</p>
              </div>
            )}
          </Col>
        </Row>
        {/* dropzone to upload new image */}
        <Row>
          <Col>
            <div
              {...getRootProps({
                className: 'primary-image-dropzone form-control' 
              })}
            >
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>{t('dragActiveLabel')}</p> :
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <i className="bi bi-image" style={{ fontSize: '3rem' }}></i>
                    <p className="text-center">{" "}{t('selectFileLabel')}</p>
                  </div>
              }
            </div>
            <div className="text-muted small">
              <p>
                {t.rich('fileHelpText', {
                  bold: (chunks) => <strong>{chunks}</strong>
                })}
              </p>
            </div>
          </Col>
        </Row>
        {/* preview selected image */}
        {files && files.length > 0 && (
          <>
            <Row>
              {files.map(previewFile => (
                <Col key={previewFile.file.name}>
                  <div className="primary-image-wrapper">
                    <Image
                      src={previewFile.preview}
                      alt={previewFile.file.name}
                      fill={true}
                      className="primary-image"
                      priority={true}
                    />
                  </div>
                  {/* Display image info */}
                  <div className="mt-2 text-muted small">
                    <Row xs={1} sm={2} md={3} lg={4} xxl={6} className="g-2">
                      <Col>
                        <span>
                          <strong>{t('fileNameLabel')}:</strong> {previewFile.file.name}
                        </span>
                      </Col>
                      <Col>
                        <span>
                          <strong>{t('sizeLabel')}:</strong> {formatFileSize(previewFile.file.size)}
                        </span>
                      </Col>
                      {previewFile.dimensions && (
                        <>
                          <Col>
                            <span>
                              <strong>{t('dimensionsLabel')}:</strong> {previewFile.dimensions.width} × {previewFile.dimensions.height} px
                            </span>
                          </Col>
                          <Col>
                            <span>
                              <strong>{t('orientationLabel')}:</strong> {getOrientation(previewFile.dimensions.width, previewFile.dimensions.height)}
                            </span>
                          </Col>
                          <Col>
                            <span>
                              <strong>{t('aspectRatioLabel')}:</strong> {getAspectRatio(previewFile.dimensions.width, previewFile.dimensions.height)}
                            </span>
                          </Col>
                        </>
                      )}
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>
            <Row className="my-2">
              <Col>
                <Button variant="primary" onClick={handleUpload} disabled={isPendingUploadPrimaryImage}>
                  {isPendingUploadPrimaryImage ? (
                    <>
                      <FontAwesomeIcon icon={faCircleNotch} className="me-1" spin /> {t('uploading')}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} className="me-1" /> {t('upload')}
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </>
        )}
        {/* display rejected files */}
        {fileRejections && fileRejections.length > 0 && (
          <Row>
            <Col>
              <h5>{t('fileRejectionTitle')}</h5>
              {fileRejections.map(({ file, errors }) => (
                <div key={file.path}>
                  <p>
                    {t.rich('fileRejectionLabel', {
                      bold: () => <strong>{file.path}</strong>
                    })}
                  </p>
                  <ul>
                    {errors.map(e => <li key={e.code}>{e.message}</li>)}
                  </ul>
                </div>
              ))}
            </Col>
          </Row>
        )}
        <Row>
          <Col className="d-flex justify-content-end">
            <Link href={`/dashboard/blog/${blogPost.id}`}>
              <Button variant="success">
                <FontAwesomeIcon icon={faPaperPlane} className="me-1" aria-hidden="true" />{ t('proceed') }
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
      )}
    </>
  )
}

export default UpdateBlogPostPrimaryImageForm;