"use client";
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useBookByIdQuery, useDeleteAuthorImageMutation, useUploadAuthorImageMutation } from '@/hooks/use-books';
import LoadingContainer from './loading-container';
import ImageUploadForm from './image-upload-form';
import { Locale } from '@/types/locale.types';
import { localizeField } from '@/utils/common-utils';
import { MAX_BOOK_IMAGE_SIZE } from '@/constants/validation-vars';

const baseTPath = 'components.UpdateBookAuthorImageForm';

interface UpdateBookAuthorImageFormProps {
  bookId: string;
  authorId: string;
}

const UpdateBookAuthorImageForm: React.FC<UpdateBookAuthorImageFormProps> = ({ bookId, authorId }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale() as Locale;

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
        onUpload={(formData) => uploadAuthorImageMutation({ bookId, authorId, formData })}
        onDelete={() => deleteAuthorImageMutation({bookId, authorId})}
        isPendingUpload={isPendingUpload}
        isPendingDelete={isPendingDelete}
        doneHref={`/dashboard/books/${bookId}`}
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

export default UpdateBookAuthorImageForm;