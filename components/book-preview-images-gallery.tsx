"use client";
import { useCallback, useEffect, useState } from "react";
import { LocalizedBookPreviewImage } from "@/interfaces/i-book";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import "./book-preview-images-gallery.scss";

interface BookPreviewImagesGalleryProps {
  previewImages: LocalizedBookPreviewImage[];
}

const BookPreviewImagesGallery = ({ previewImages }: BookPreviewImagesGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedImage = selectedIndex !== null ? previewImages[selectedIndex] : null;
  const total = previewImages.length;

  const closeModal = () => setSelectedIndex(null);

  const showPrev = useCallback(() => {
    setSelectedIndex(i => (i === null ? null : (i - 1 + total) % total));
  }, [total]);

  const showNext = useCallback(() => {
    setSelectedIndex(i => (i === null ? null : (i + 1) % total));
  }, [total]);

  // keyboard support while modal is open
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, showPrev, showNext]);

  if (!previewImages?.length) return null;

  return (
    <>
      <div className="preview-images-gallery">
        {previewImages.map((previewImage, index) => (
          <figure key={previewImage.id} className="preview-image-wrapper">

            <button
              type="button"
              className="preview-image-button"
              onClick={() => setSelectedIndex(index)}
              aria-label={
                previewImage.caption
                  ? `Open image: ${previewImage.caption}`
                  : "Open preview image"
              }
            >
              <Image
                src={previewImage.url}
                alt=""
                fill
                sizes="(max-width: 576px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
            </button>

            {previewImage.caption && (
              <figcaption className="preview-image-caption">
                {previewImage.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Preview image modal */}
      <Modal
        show={selectedImage !== null}
        onHide={closeModal}
        centered
        size="xl"
        fullscreen="sm-down"
        contentClassName="preview-lightbox-content"
        aria-labelledby={selectedImage?.caption ? "preview-lightbox-title" : undefined}
      >
        <Modal.Header closeButton>
          {selectedImage?.caption && (
            <Modal.Title
              id="preview-lightbox-title"
              className="preview-lightbox-title"
            >
              {selectedImage.caption}
            </Modal.Title>
          )}
        </Modal.Header>

        <Modal.Body className="preview-lightbox-body">
          {selectedImage && (
            <div className="preview-lightbox-image">
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption ?? "Book preview image"}
                fill
                sizes="100vw"
                className="preview-lightbox-img"
              />

              {total > 1 && (
                <>
                  <button
                    type="button"
                    className="preview-lightbox-nav preview-lightbox-nav--prev"
                    onClick={showPrev}
                    aria-label="Previous image"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button
                    type="button"
                    className="preview-lightbox-nav preview-lightbox-nav--next"
                    onClick={showNext}
                    aria-label="Next image"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                  <div className="preview-lightbox-counter">
                    {selectedIndex! + 1} / {total}
                  </div>
                </>
              )}
            </div>
          )}
        </Modal.Body>

      </Modal>
    </>
  );
};

export default BookPreviewImagesGallery;