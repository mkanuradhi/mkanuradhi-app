"use client";
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useDeleteInterviewerImageMutation, useMediaContributionByIdQuery, useUploadInterviewerImageMutation } from '@/hooks/use-media-contributions';
import LoadingContainer from './loading-container';
import ImageUploadForm from './image-upload-form';
import { Locale } from '@/types/locale.types';
import { localizeField } from '@/utils/common-utils';
import { MAX_MEDIA_CONTRIBUTION_IMAGE_SIZE } from '@/constants/validation-vars';

const baseTPath = 'components.UpdateInterviewerImageForm';

interface UpdateMediaContributionInterviewerImageFormProps {
  mediaContributionId: string;
  interviewerId: string;
}

const UpdateMediaContributionInterviewerImageForm: React.FC<UpdateMediaContributionInterviewerImageFormProps> = ({ mediaContributionId, interviewerId }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale() as Locale;

  const { data: mediaContribution, isPending, isError, isFetching, isSuccess, error } = useMediaContributionByIdQuery(mediaContributionId);
  const { mutateAsync: uploadInterviewerImageMutation, isPending: isPendingUpload } = useUploadInterviewerImageMutation();
  const { mutateAsync: deleteInterviewerImageMutation, isPending: isPendingDelete } = useDeleteInterviewerImageMutation();

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

  const interviewer = mediaContribution.interviewers?.find((a) => a.id === interviewerId);
  const interviewerName = localizeField(interviewer?.name, locale);

  return (
    <>
      <Row>
        <Col>
          <h5 className='my-3'>{t('subtitle', { interviewerName })}</h5>
        </Col>
      </Row>
      <ImageUploadForm
        currentImageUrl={interviewer?.imageUrl || ''}
        altText={interviewer?.name.en || ''}
        fieldName="interviewerImage"
        onUpload={(formData) => uploadInterviewerImageMutation({ mediaContributionId, interviewerId, formData })}
        onDelete={() => deleteInterviewerImageMutation({mediaContributionId, interviewerId})}
        isPendingUpload={isPendingUpload}
        isPendingDelete={isPendingDelete}
        doneHref={`/dashboard/media-contributions/${mediaContributionId}`}
        maxSize={MAX_MEDIA_CONTRIBUTION_IMAGE_SIZE}
        accept={['image/jpeg', 'image/png', 'image/svg+xml']}
        maxImageSize={300}
        labels={{
          noImage:            t('noInterviewerImage'),
          deleteImage:        t('deleteInterviewerImage'),
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
    </>
  );
};

export default UpdateMediaContributionInterviewerImageForm;