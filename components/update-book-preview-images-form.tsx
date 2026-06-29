"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useBookByIdQuery, useUploadPreviewImagesMutation } from '@/hooks/use-books';
import LoadingContainer from './loading-container';
import ImagesUploadForm from './images-upload-form';

const baseTPath = 'components.UpdateBookPreviewImagesForm';

interface UpdateBookPreviewImagesFormProps {
  bookId: string;
}

const UpdateBookPreviewImagesForm: React.FC<UpdateBookPreviewImagesFormProps> = ({ bookId }) => {
  const t = useTranslations(baseTPath);

  const { data: book, isPending, isError, isFetching, isSuccess, error } = useBookByIdQuery(bookId);
  const { mutateAsync: uploadPreviewImagesMutation, isPending: isPendingUpload } = useUploadPreviewImagesMutation();

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
    <ImagesUploadForm
      currentImages={book.previewImages}
      altText={book.title.en || ""}
      fieldName="previewImages"
      onUpload={(formData) => uploadPreviewImagesMutation({ id: bookId, formData })}
      isPendingUpload={isPendingUpload}
      doneHref={`/dashboard/books/${bookId}`}
      maxSize={5 * 1024 * 1024}
      maxFiles={15}
      labels={{
        noImages: t("noPreviewImages"),
        dragActive: t("dragActiveLabel"),
        selectFiles: t("selectFilesLabel"),
        selectedFileName: t("selectedFileNameLabel"),
        selectedFileSize: t("selectedFileSizeLabel"),
        selectedFileDimensions: t("selectedFileDimensionsLabel"),
        uploading: t("uploading"),
        upload: t("upload"),
        remove: t("remove"),
        fileRejectionTitle: t("fileRejectionTitle"),
        fileRejectionName: name =>
          t.rich("fileRejectionName", {
            name,
            strong: chunks => <strong>{chunks}</strong>,
          }),
        done: t("done"),
      }}
    />
  );
};

export default UpdateBookPreviewImagesForm;