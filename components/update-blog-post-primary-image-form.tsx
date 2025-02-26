import BlogPost from '@/interfaces/i-blog-post';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { useUploadBlogPostPrimaryImageMutation } from '@/hooks/use-blog-posts';
import "./update-blog-post-primary-image-form.scss";

const baseTPath = 'components.UpdateBlogPostPrimaryImageForm';

interface UpdateBlogPostPrimaryImageFormProps {
  id: string;
  onSuccess: (blogPost: BlogPost) => void;
}

interface PreviewFile extends File {
  preview: string;
}

const UpdateBlogPostPrimaryImageForm: React.FC<UpdateBlogPostPrimaryImageFormProps> = ({ id, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const { mutateAsync: uploadBlogPostPrimaryImageMutation, isPending: isPendingUploadPrimaryImage } = useUploadBlogPostPrimaryImageMutation();

  const onDrop = useCallback( (acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setFiles(previousFiles => [
        ...previousFiles,
        ...acceptedFiles.map(file => 
          Object.assign(file, {preview: URL.createObjectURL(file)})
        )
      ]);
    }
  }, [])

  const {getRootProps, getInputProps, fileRejections, isDragActive} = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isPendingUploadPrimaryImage,
    onDrop
  });

  const handleUpload = () => {
    if (!files.length) return;
    
    const formData = new FormData();
    formData.append('primaryImage', files[0]);

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
      <div className="update-blog-post-primary-image-form">
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
                  <p>{t('selectFileLabel')}</p>
              }
            </div>
          </Col>
        </Row>
        {files && files.length > 0 && (
          <>
            <Row>
              {files.map(file => (
                <Col key={file.name}>
                  <div className="primary-image-wrapper">
                    <Image
                      src={file.preview}
                      alt={file.name}
                      fill={true}
                      className="primary-image"
                      priority={true}
                    />
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
        {fileRejections && fileRejections.length > 0 && (
          <Row>
            <Col>
              <h5>{t('fileRejectionTitle')}</h5>
              {fileRejections.map(({ file, errors }) => (
                <div key={file.path}>
                  <p>{t.rich('fileRejectionLabel', {name: file.path})}</p>
                  <ul>
                    {errors.map(e => <li key={e.code}>{e.message}</li>)}
                  </ul>
                </div>
              ))}
            </Col>
          </Row>
        )}
      </div>
    </>
  )
}

export default UpdateBlogPostPrimaryImageForm;