import Award from '@/interfaces/i-award';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faPaperPlane, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { useAwardByIdQuery, useDeleteAwardPrimaryImageMutation, useUploadAwardPrimaryImageMutation } from '@/hooks/use-awards';
import LoadingContainer from './loading-container';
import { Link } from '@/i18n/routing';
import "./update-award-primary-image-form.scss";

const baseTPath = 'components.UpdateAwardPrimaryImageForm';

interface UpdateAwardPrimaryImageFormProps {
  id: string;
  onSuccess: (award: Award) => void;
}

interface PreviewFile extends File {
  preview: string;
}

const UpdateAwardPrimaryImageForm: React.FC<UpdateAwardPrimaryImageFormProps> = ({ id, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const { data: award, isPending, isError, isFetching, isSuccess, error } = useAwardByIdQuery(id);
  const { mutateAsync: uploadAwardPrimaryImageMutation, isPending: isPendingUploadPrimaryImage } = useUploadAwardPrimaryImageMutation();
  const { mutateAsync: deleteAwardPrimaryImageMutation, isPending: isPendingDeletePrimaryImage } = useDeleteAwardPrimaryImageMutation();

  const onDrop = useCallback( (acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    }
  }, [])

  const {getRootProps, getInputProps, fileRejections, isDragActive} = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isPendingUploadPrimaryImage || isPendingDeletePrimaryImage,
    onDrop
  });

  const handleUpload = () => {
    if (!files.length) return;
    
    const formData = new FormData();
    formData.append('primaryImage', files[0]);

    uploadAwardPrimaryImageMutation(
      { id, formData },
      {
        onSuccess: (updatedAward) => {
          onSuccess(updatedAward);
          setFiles([]); // Clear uploaded file after success
        },
      }
    );
  }

  const clearFiles = () => {
    // Revoke the object URLs
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
  }

  const handleRemovePreview = () => {
    clearFiles();
  }

  const handleDeletePrimaryImage = () => {
    deleteAwardPrimaryImageMutation(
      id,
      {
        onSuccess: (updatedAward) => {
          onSuccess(updatedAward);
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
      {isSuccess && award && (
      <div className="update-award-primary-image-form">
        <Row>
          <Col>
            {award.primaryImage ? (
              <>
                <div className="primary-image-wrapper">
                  <Image
                    src={award.primaryImage}
                    alt={award.titleEn}
                    fill={true}
                    className="primary-image"
                    priority={true}
                  />
                </div>
                <div className="mt-2">
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={handleDeletePrimaryImage} 
                    disabled={isPendingDeletePrimaryImage}
                  >
                    {isPendingDeletePrimaryImage ? (
                      <>
                        <FontAwesomeIcon icon={faCircleNotch} className="me-1" spin /> {t('deleting')}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faTrash} className="me-1" /> {t('deletePrimaryImage')}
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div>
                <p>{t('noPrimaryImage')}</p>
              </div>
            )}
          </Col>
        </Row>
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
          </Col>
        </Row>
        {files && files.length > 0 && (
          <div className="mb-4">
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
                <Button variant="primary" onClick={handleUpload} disabled={isPendingUploadPrimaryImage || isPendingDeletePrimaryImage}>
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
              <Col xs="auto">
                <Button 
                  variant="danger" 
                  onClick={handleRemovePreview} 
                  disabled={isPendingUploadPrimaryImage || isPendingDeletePrimaryImage}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-1" /> {t('remove')}
                </Button>
              </Col>
            </Row>
          </div>
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
        <Row>
          <Col className="d-flex justify-content-end">
            <Link href={`/dashboard/awards/${award.id}`}>
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

export default UpdateAwardPrimaryImageForm;