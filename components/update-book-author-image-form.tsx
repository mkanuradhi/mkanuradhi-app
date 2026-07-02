"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useBookByIdQuery, useDeleteAuthorImageMutation, useUploadAuthorImageMutation } from '@/hooks/use-books';
import LoadingContainer from './loading-container';
import ImageUploadForm from './image-upload-form';

const baseTPath = 'components.UpdateBookAuthorImageForm';

interface UpdateBookAuthorImageFormProps {
  bookId: string;
  authorId: string;
}

const UpdateBookAuthorImageForm: React.FC<UpdateBookAuthorImageFormProps> = ({ bookId, authorId }) => {
  const t = useTranslations(baseTPath);

  const { data: book, isPending, isError, isFetching, isSuccess, error } = useBookByIdQuery(bookId);
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

  if (!isSuccess || !book) return null;

  const author = book.authors.find((a) => a.id === authorId);

  // Render

  return (
    <ImageUploadForm
      currentImageUrl={author?.imageUrl || ''}
      altText={author?.name.en || ''}
      fieldName="authorImage"
      onUpload={(formData) => uploadAuthorImageMutation({ bookId, authorId, formData })}
      onDelete={() => deleteAuthorImageMutation({bookId, authorId})}
      isPendingUpload={isPendingUpload}
      isPendingDelete={isPendingDelete}
      doneHref={`/dashboard/books/${bookId}`}
      maxSize={5 * 1024 * 1024}
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
  );
};

export default UpdateBookAuthorImageForm;