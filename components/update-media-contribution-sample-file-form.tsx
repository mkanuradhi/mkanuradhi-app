"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import LoadingContainer from './loading-container';
import FileUploadForm from './file-upload-form';
import { MAX_MEDIA_CONTRIBUTION_FILE_SIZE } from '@/constants/validation-vars';
import { useDeleteSampleFileMutation, useMediaContributionByIdQuery, useUploadSampleFileMutation } from '@/hooks/use-media-contributions';

const baseTPath = 'components.UpdateSampleFileForm';

interface UpdateMediaContributionSampleFileFormProps {
  mediaContributionId: string;
}

const UpdateMediaContributionSampleFileForm: React.FC<UpdateMediaContributionSampleFileFormProps> = ({ mediaContributionId }) => {
  const t = useTranslations(baseTPath);

  const { data: mediaContribution, isPending, isError, isFetching, isSuccess, error } = useMediaContributionByIdQuery(mediaContributionId);
  const { mutateAsync: uploadSampleFileMutation, isPending: isPendingUpload } = useUploadSampleFileMutation();
  const { mutateAsync: deleteSampleFileMutation, isPending: isPendingDelete } = useDeleteSampleFileMutation();

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
    <FileUploadForm
      currentFileUrl={mediaContribution.pdfLink}
      altText={mediaContribution.title.en || ''}
      fieldName="pdfFile"
      onUpload={(formData) => uploadSampleFileMutation({ id: mediaContributionId, formData })}
      onDelete={() => deleteSampleFileMutation(mediaContributionId)}
      isPendingUpload={isPendingUpload}
      isPendingDelete={isPendingDelete}
      doneHref={`/dashboard/media-contributions/${mediaContributionId}`}
      maxSize={MAX_MEDIA_CONTRIBUTION_FILE_SIZE}
      accept={['application/pdf']}
      labels={{
        noFile:             t('noSampleFile'),
        deleteFile:         t('deleteSampleFile'),
        deleting:           t('deleting'),
        dragActive:         t('dragActiveLabel'),
        selectFile:         t('selectFileLabel'),
        selectedFileName:   t('selectedFileNameLabel'),
        selectedFileSize:   t('selectedFileSizeLabel'),
        uploading:          t('uploading'),
        upload:             t('upload'),
        remove:             t('remove'),
        fileRejectionTitle: t('fileRejectionTitle'),
        fileRejectionName:  (name) => t.rich('fileRejectionName', {
          name,
          strong: (chunks) => <strong>{chunks}</strong>,
        }),
        done:               t('done'),
      }}
    />
  );
};

export default UpdateMediaContributionSampleFileForm;