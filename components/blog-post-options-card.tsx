"use client";
import Link from "next/link";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useLocale, useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader, faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useDeleteBlogPostMutation, usePublishBlogPostMutation, useUnpublishBlogPostMutation } from "@/hooks/use-blog-posts";
import "./blog-post-options-card.scss";

const baseTPath = 'components.BlogPostOptionsCard';

interface BlogPostCardOptionsProps {
  id: string;
  titleEn: string;
  summaryEn: string;
  titleSi: string;
  summarySi: string;
  img?: string;
  path: string;
  dateTime: Date;
  published: boolean;
}

const BlogPostOptionsCard: React.FC<BlogPostCardOptionsProps> = ({id, titleEn, summaryEn, titleSi, summarySi, img, path, dateTime, published}) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const [show, setShow] = useState(false);

  const selectedTitle = locale === "si" ? `'${titleSi}'` : `'${titleEn}'`;

  const { mutate: deleteBlogPostMutation, isPending: isPendingDelete } = useDeleteBlogPostMutation();
  const { mutate: publishBlogPostMutation, isPending: isPendingPublish } = usePublishBlogPostMutation();
  const { mutate: unpublishBlogPostMutation, isPending: isPendingUnpublish } = useUnpublishBlogPostMutation();

  const handleDeleteBlogPost = async () => {
    deleteBlogPostMutation(id);
    handleClose();
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlePublish = () => {
    publishBlogPostMutation(id);
  }

  const handleUnpublish = () => {
    unpublishBlogPostMutation(id);
  }

  return (
    <>
      <Card className="my-3 shadow blog-post-options-card">
        <Row className="g-0 flex-column flex-md-row">
        {img && (
          <Col md={4}>
            <Card.Img
              src={img}
              alt={`Image for ${titleEn}`}
              style={{ objectFit: 'cover', height: '100%', maxHeight: '32rem' }}
            />
          </Col>
          )}
          {/* Right Column for the Content */}
          <Col md={img ? 8 : 12}>
            <Card.Body>
              <Card.Title>
                { titleEn }
              </Card.Title>
              <Card.Title>
                { titleSi }
              </Card.Title>
              <Card.Text className="text-muted fs-7">
                { new Date(dateTime).toLocaleDateString() }
              </Card.Text>
              <hr className="divider" />
              <Card.Text>
                { summaryEn }
              </Card.Text>
              <Card.Text>
                { summarySi }
              </Card.Text>
              <Link href={`blog/${id}`}>
                <Button>
                  <FontAwesomeIcon icon={faBookOpenReader} className="list-icon" /> { t('read') }
                </Button>
              </Link>
              <Button
                variant={published ? `warning` : `success`}
                className="ms-2"
                onClick={published ? handleUnpublish : handlePublish}
                disabled={isPendingPublish || isPendingUnpublish}
              >
                <FontAwesomeIcon
                  icon={published ? faEyeSlash : faEye}
                  className="list-icon"
                />{" "}
                {published ? t('unpublish') : t('publish')}
              </Button>
              <Button variant="danger" className="ms-2" onClick={handleShow} disabled={isPendingDelete}>
                <FontAwesomeIcon icon={faTrash} className="list-icon" /> { t('delete') }
              </Button>
            </Card.Body>
          </Col>
        </Row>
        <div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{t('deleteModalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                t.rich('deleteModalMessage', {
                  strong: () => <strong>{selectedTitle}</strong>,
                })
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t('deleteModalCancel')}
              </Button>
              <Button variant="danger" onClick={handleDeleteBlogPost}>
                {t('deleteModalAccept')}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Card>
    </>
  )
}

export default BlogPostOptionsCard;