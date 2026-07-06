"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useBookByIdQuery, useDeleteCoverImageMutation, useUploadCoverImageMutation } from '@/hooks/use-books';
import LoadingContainer from './loading-container';
import ImageUploadForm from './image-upload-form';
import { MAX_BOOK_IMAGE_SIZE } from '@/constants/validation-vars';

const baseTPath = 'components.UpdateBookCoverImageForm';

interface UpdateBookCoverImageFormProps {
  bookId: string;
}

const UpdateBookCoverImageForm: React.FC<UpdateBookCoverImageFormProps> = ({ bookId }) => {
  const t = useTranslations(baseTPath);

  const { data: book, isPending, isError, isFetching, isSuccess, error } = useBookByIdQuery(bookId);
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

  if (!isSuccess || !book) return null;

  // Render

  return (
    <ImageUploadForm
      currentImageUrl={book.coverImage}
      altText={book.title.en || ''}
      fieldName="coverImage"
      onUpload={(formData) => uploadCoverImageMutation({ id: bookId, formData })}
      onDelete={() => deleteCoverImageMutation(bookId)}
      isPendingUpload={isPendingUpload}
      isPendingDelete={isPendingDelete}
      doneHref={`/dashboard/books/${bookId}`}
      maxSize={MAX_BOOK_IMAGE_SIZE}
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

export default UpdateBookCoverImageForm;