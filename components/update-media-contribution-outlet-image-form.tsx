"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useDeleteOutletImageMutation,
  useMediaContributionByIdQuery,
  useUploadOutletImageMutation } from '@/hooks/use-media-contributions';
import LoadingContainer from './loading-container';
import ImageUploadForm from './image-upload-form';
import { MAX_BOOK_IMAGE_SIZE } from '@/constants/validation-vars';

const baseTPath = 'components.UpdateMediaContributionOutletImageForm';

interface UpdateMediaContributionOutletImageFormProps {
  mediaContributionId: string;
}

const UpdateMediaContributionOutletImageForm: React.FC<UpdateMediaContributionOutletImageFormProps> = ({ mediaContributionId }) => {
  const t = useTranslations(baseTPath);

  const { data: mediaContribution, isPending, isError, isFetching, isSuccess, error } = useMediaContributionByIdQuery(mediaContributionId);
  const { mutateAsync: uploadOutletImageMutation, isPending: isPendingUpload } = useUploadOutletImageMutation();
  const { mutateAsync: deleteOutletImageMutation, isPending: isPendingDelete } = useDeleteOutletImageMutation();

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
      currentImageUrl={mediaContribution.outlet?.imageUrl}
      altText={mediaContribution.outlet?.name.en || ''}
      fieldName="outletImage"
      onUpload={(formData) => uploadOutletImageMutation({ id: mediaContributionId, formData })}
      onDelete={() => deleteOutletImageMutation(mediaContributionId)}
      isPendingUpload={isPendingUpload}
      isPendingDelete={isPendingDelete}
      doneHref={`/dashboard/media-contributions/${mediaContributionId}`}
      maxSize={MAX_BOOK_IMAGE_SIZE}
      accept={['image/jpeg', 'image/png', 'image/svg+xml']}
      maxImageSize={300}
      labels={{
        noImage:            t('noOutletImage'),
        deleteImage:        t('deleteOutletImage'),
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

export default UpdateMediaContributionOutletImageForm;