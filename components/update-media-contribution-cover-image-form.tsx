"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useDeleteCoverImageMutation, useMediaContributionByIdQuery, useUploadCoverImageMutation } from '@/hooks/use-media-contributions';
import LoadingContainer from './loading-container';
import ImageUploadForm from './image-upload-form';
import { MAX_MEDIA_CONTRIBUTION_IMAGE_SIZE } from '@/constants/validation-vars';

const baseTPath = 'components.UpdateBookCoverImageForm';

interface UpdateMediaContributionCoverImageFormProps {
  mediaContributionId: string;
}

const UpdateMediaContributionCoverImageForm: React.FC<UpdateMediaContributionCoverImageFormProps> = ({ mediaContributionId }) => {
  const t = useTranslations(baseTPath);

  const { data: mediaContribution, isPending, isError, isFetching, isSuccess, error } = useMediaContributionByIdQuery(mediaContributionId);
  const { mutateAsync: uploadCoverImageMutation, isPending: isPendingUpload } = useUploadCoverImageMutation();
  const { mutateAsync: deleteCoverImageMutation, isPending: isPendingDelete } = useDeleteCoverImageMutation();

  // Loading / error states

  if (isPending || isFetching) return <LoadingContainer />;

  if (isError && error) {
    return (
      <Row><Col>
        <p className="text-danger">{error.message}</p>
      </Col></Row>
    );
  }

  if (!isSuccess || !mediaContribution) return null;

  // Render

  return (
    <ImageUploadForm
      currentImageUrl={mediaContribution.coverImage}
      altText={mediaContribution.title.en || ''}
      fieldName="coverImage"
      onUpload={(formData) => uploadCoverImageMutation({ id: mediaContributionId, formData })}
      onDelete={() => deleteCoverImageMutation(mediaContributionId)}
      isPendingUpload={isPendingUpload}
      isPendingDelete={isPendingDelete}
      doneHref={`/dashboard/media-contributions/${mediaContributionId}`}
      maxSize={MAX_MEDIA_CONTRIBUTION_IMAGE_SIZE}
      accept={['image/jpeg', 'image/png', 'image/svg+xml']}
      maxImageSize={300}
      labels={{
        noImage:            t('noCoverImage'),
        deleteImage:        t('deleteCoverImage'),
        deleting:           t('deleting'),
        dragActive:         t('dragActiveLabel'),
        selectFile:         t('selectFileLabel'),
        selectedFileName:   t('selectedFileNameLabel'),
        selectedFileSize:   t('selectedFileSizeLabel'),
        selectedFileDimensions: t('selectedFileDimensionsLabel'),
        uploading:          t('uploading'),
        upload:             t('upload'),
        remove:             t('remove'),
        fileRejectionTitle: t('fileRejectionTitle'),
        fileRejectionName: (name) => t.rich('fileRejectionName', {
          name,
          strong: (chunks) => <strong>{chunks}</strong>,
        }),
        done:               t('done'),
      }}
    />
  );
};

export default UpdateMediaContributionCoverImageForm;