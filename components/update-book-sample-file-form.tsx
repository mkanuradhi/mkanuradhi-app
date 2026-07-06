"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useBookByIdQuery, useDeleteSampleFileMutation, useUploadSampleFileMutation } from '@/hooks/use-books';
import LoadingContainer from './loading-container';
import FileUploadForm from './file-upload-form';
import { MAX_BOOK_FILE_SIZE } from '@/constants/validation-vars';

const baseTPath = 'components.UpdateBookSampleFileForm';

interface UpdateBookSampleFileFormProps {
  bookId: string;
}

const UpdateBookSampleFileForm: React.FC<UpdateBookSampleFileFormProps> = ({ bookId }) => {
  const t = useTranslations(baseTPath);

  const { data: book, isPending, isError, isFetching, isSuccess, error } = useBookByIdQuery(bookId);
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

  if (!isSuccess || !book) return null;

  // Render

  return (
    <FileUploadForm
      currentFileUrl={book.pdfTeaser}
      altText={book.title.en || ''}
      fieldName="pdfTeaser"
      onUpload={(formData) => uploadSampleFileMutation({ id: bookId, formData })}
      onDelete={() => deleteSampleFileMutation(bookId)}
      isPendingUpload={isPendingUpload}
      isPendingDelete={isPendingDelete}
      doneHref={`/dashboard/books/${bookId}`}
      maxSize={MAX_BOOK_FILE_SIZE}
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

export default UpdateBookSampleFileForm;