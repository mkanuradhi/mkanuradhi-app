"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import DOMPurify from 'dompurify';
import { Alert, Breadcrumb, Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { Link, useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { LOCALE_EN, LOCALE_SI } from '@/constants/common-vars';
import { getFormattedDate, getFormattedTime } from '@/utils/common-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useBlogPostByIdQuery, useDeleteBlogPostMutation, usePublishBlogPostMutation, useUnpublishBlogPostMutation } from '@/hooks/use-blog-posts';
import LoadingContainer from './loading-container';
import "./blog-post-options-viewer.scss";

const baseTPath = 'components.BlogPostOptionsViewer';

interface BlogPostOptionsViewerProps {
  blogPostId: string;
}

const getSanitizedHtml = (html: string | undefined): string => {
  if (!html) return ""; // Ensures it returns a string, preventing TypeScript errors
  return DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ['target', 'href', 'rel', 'src', 'alt', 'style'],
  });
};

const BlogPostOptionsViewer: React.FC<BlogPostOptionsViewerProps> = ({ blogPostId }) => {
  const t = useTranslations(baseTPath);
  const [show, setShow] = useState(false);
  const router = useRouter();

  const { data: blogPost, isPending, isError, isFetching, isSuccess } = useBlogPostByIdQuery(blogPostId);
  const { mutate: deleteBlogPostMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteBlogPostMutation();
  const { mutate: publishBlogPostMutation, isPending: isPendingPublish, isError: isPublishError, error: publishError } = usePublishBlogPostMutation();
  const { mutate: unpublishBlogPostMutation, isPending: isPendingUnpublish, isError: isUnpublishError, error: unpublishError } = useUnpublishBlogPostMutation();

  if (isPending || isFetching) {
    return (<LoadingContainer />);
  }

  if (isError || !blogPost) {
    return (
      <Row>
        <Col>{t('failPosts')}</Col>
      </Row>
    );
  }

  const selectedTitle = `'${blogPost.titleEn}' | '${blogPost.titleSi}'`;

  const handleDeleteBlogPost = async () => {
    deleteBlogPostMutation(blogPost.id);
    handleClose();
    router.replace('/dashboard/blog');
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlePublish = () => {
    publishBlogPostMutation(blogPost.id);
  }

  const handleUnpublish = () => {
    unpublishBlogPostMutation(blogPost.id);
  }

  return (
    <>
      <Container fluid="md" className="blog-post-options-viewer">
        <Row>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard">{t('dashboard')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard/blog">{t('blog')}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <Row>
              <Col>
                <h1>{blogPost.titleEn}</h1>
                <p className="fs-7">
                  <span className="text-muted fs-7">{ getFormattedDate(LOCALE_EN, blogPost.dateTime) } { getFormattedTime(LOCALE_EN, blogPost.dateTime) }</span>
                </p>
                <hr className="divider" />
              </Col>
            </Row>
            {blogPost.primaryImage && (
              <Row className="mb-3">
                <Col>
                  <div className="primary-image-wrapper">
                    <Image
                      src={blogPost.primaryImage}
                      alt={blogPost.titleEn}
                      fill={true}
                      className="primary-image"
                      priority={true}
                    />
                  </div>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <div dangerouslySetInnerHTML={{ __html: getSanitizedHtml(blogPost.contentEn) }} />
              </Col>
            </Row>
          </Col>
        </Row>
        {/* ----------------- Si ----------------- */}
        <Row className="my-4">
          <Col>
            <Row>
              <Col>
                <h1>{blogPost.titleSi}</h1>
                <p className="fs-7">
                  <span className="text-muted fs-7">{ getFormattedDate(LOCALE_SI, blogPost.dateTime) } { getFormattedTime(LOCALE_SI, blogPost.dateTime) }</span>
                </p>
                <hr className="divider" />
              </Col>
            </Row>
            {blogPost.primaryImage && (
              <Row className="mb-3">
                <Col>
                  <div className="primary-image-wrapper">
                    <Image
                      src={blogPost.primaryImage}
                      alt={blogPost.titleSi}
                      fill={true}
                      className="primary-image"
                      priority={true}
                    />
                  </div>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <div dangerouslySetInnerHTML={{ __html: getSanitizedHtml(blogPost.contentSi) }} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link href={`/dashboard/blog/${blogPost.id}/edit`}>
              <Button variant="secondary" className="me-2">
                <FontAwesomeIcon icon={faPen} className="me-1" /> { t('edit') }
              </Button>
            </Link>
            <Button
              variant={blogPost.published ? `warning` : `success`}
              className="me-2"
              onClick={blogPost.published ? handleUnpublish : handlePublish}
              disabled={isPendingPublish || isPendingUnpublish}
            >
              <FontAwesomeIcon
                icon={blogPost.published ? faEyeSlash : faEye}
                className="list-icon"
              />{" "}
              {blogPost.published ? t('unpublish') : t('publish')}
            </Button>
            <Button variant="danger" className="me-2" onClick={handleShow} disabled={isPendingDelete}>
              <FontAwesomeIcon icon={faTrash} className="list-icon" /> { t('delete') }
            </Button>
          </Col>
        </Row>
        {isPublishError && publishError && (
          <Row className="my-3">
            <Col>
              <Alert variant="danger" dismissible>
                <Alert.Heading>{t('publishErrorTitle')}</Alert.Heading>
                <p>{publishError.message}</p>
              </Alert>
            </Col>
          </Row>
        )}
        {isUnpublishError && unpublishError && (
          <Row className="my-3">
            <Col>
              <Alert variant="danger" dismissible>
                <Alert.Heading>{t('unpublishErrorTitle')}</Alert.Heading>
                <p>{unpublishError.message}</p>
              </Alert>
            </Col>
          </Row>
        )}
        {isDeleteError && deleteError && (
          <Row className="my-3">
            <Col>
              <Alert variant="danger" dismissible>
                <Alert.Heading>{t('deleteErrorTitle')}</Alert.Heading>
                <p>{deleteError.message}</p>
              </Alert>
            </Col>
          </Row>
        )}
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
      </Container>
    </>
  )
}

export default BlogPostOptionsViewer;