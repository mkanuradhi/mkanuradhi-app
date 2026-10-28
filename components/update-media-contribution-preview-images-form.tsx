"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Col, Row } from 'react-bootstrap';
import { useDeletePreviewImageMutation, useMediaContributionByIdQuery, useUploadPreviewImagesMutation } from '@/hooks/use-media-contributions';
import LoadingContainer from './loading-container';
import ImagesUploadForm from './images-upload-form';
import { MAX_MEDIA_CONTRIBUTION_IMAGE_SIZE, MAX_MEDIA_CONTRIBUTION_IMAGES } from '@/constants/validation-vars';

const baseTPath = 'components.UpdatePreviewImagesForm';

interface UpdateMediaContributionPreviewImagesFormProps {
  mediaContributionId: string;
}

const UpdateMediaContributionPreviewImagesForm: React.FC<UpdateMediaContributionPreviewImagesFormProps> = ({ mediaContributionId }) => {
  const t = useTranslations(baseTPath);

  const { data: mediaContribution, isPending, isError, isFetching, isSuccess, error } = useMediaContributionByIdQuery(mediaContributionId);
  const { mutateAsync: uploadPreviewImagesMutation, isPending: isPendingUpload } = useUploadPreviewImagesMutation();
  const { mutateAsync: deletePreviewImageMutation, isPending: isPendingDelete } = useDeletePreviewImageMutation();

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
    <ImagesUploadForm
      currentImages={mediaContribution.previewImages}
      altText={mediaContribution.title.en || ""}
      fieldName="previewImages"
      onUpload={(formData) => uploadPreviewImagesMutation({ id: mediaContributionId, formData })}
      onDelete={(previewImageId) => deletePreviewImageMutation({mediaContributionId, previewImageId})}
      isPendingUpload={isPendingUpload}
      isPendingDelete={isPendingDelete}
      doneHref={`/dashboard/media-contributions/${mediaContributionId}`}
      maxSize={MAX_MEDIA_CONTRIBUTION_IMAGE_SIZE}
      maxFiles={MAX_MEDIA_CONTRIBUTION_IMAGES}
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

export default UpdateMediaContributionPreviewImagesForm;