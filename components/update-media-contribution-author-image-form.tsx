"use client";
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useDeleteAuthorImageMutation, useMediaContributionByIdQuery, useUploadAuthorImageMutation } from '@/hooks/use-media-contributions';
import LoadingContainer from './loading-container';
import ImageUploadForm from './image-upload-form';
import { Locale } from '@/types/locale.types';
import { localizeField } from '@/utils/common-utils';
import { MAX_BOOK_IMAGE_SIZE } from '@/constants/validation-vars';

const baseTPath = 'components.UpdateAuthorImageForm';

interface UpdateMediaContributionAuthorImageFormProps {
  mediaContributionId: string;
  authorId: string;
}

const UpdateMediaContributionAuthorImageForm: React.FC<UpdateMediaContributionAuthorImageFormProps> = ({ mediaContributionId, authorId }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale() as Locale;

  const { data: mediaContribution, isPending, isError, isFetching, isSuccess, error } = useMediaContributionByIdQuery(mediaContributionId);
  const { mutateAsync: uploadAuthorImageMutation, isPending: isPendingUpload } = useUploadAuthorImageMutation();
  const { mutateAsync: deleteAuthorImageMutation, isPending: isPendingDelete } = useDeleteAuthorImageMutation();

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

  const author = mediaContribution.authors?.find((a) => a.id === authorId);
  const authorName = localizeField(author?.name, locale);

  return (
    <>
      <Row>
        <Col>
          <h5 className='my-3'>{t('subtitle', { authorName })}</h5>
        </Col>
      </Row>
      <ImageUploadForm
        currentImageUrl={author?.imageUrl || ''}
        altText={author?.name.en || ''}
        fieldName="authorImage"
        onUpload={(formData) => uploadAuthorImageMutation({ mediaContributionId, authorId, formData })}
        onDelete={() => deleteAuthorImageMutation({mediaContributionId, authorId})}
        isPendingUpload={isPendingUpload}
        isPendingDelete={isPendingDelete}
        doneHref={`/dashboard/media-contributions/${mediaContributionId}`}
        maxSize={MAX_BOOK_IMAGE_SIZE}
        accept={['image/jpeg', 'image/png', 'image/svg+xml']}
        maxImageSize={300}
        labels={{
          noImage:            t('noAuthorImage'),
          deleteImage:        t('deleteAuthorImage'),
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

export default UpdateMediaContributionAuthorImageForm;