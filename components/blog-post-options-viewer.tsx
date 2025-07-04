"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import DOMPurify from 'dompurify';
import { Alert, Breadcrumb, Button, Col, Container, Row } from 'react-bootstrap';
import { Link, useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { LOCALE_EN, LOCALE_SI } from '@/constants/common-vars';
import { getFormattedDate, getFormattedTime } from '@/utils/common-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useBlogPostByIdQuery, useDeleteBlogPostMutation, usePublishBlogPostMutation, useUnpublishBlogPostMutation } from '@/hooks/use-blog-posts';
import LoadingContainer from './loading-container';
import DocumentStatus from '@/enums/document-status';
import DeleteModal from './delete-modal';
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
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const { data: blogPost, isPending, isError, isFetching, isSuccess, error: blogpostError } = useBlogPostByIdQuery(blogPostId);
  const { mutate: deleteBlogPostMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteBlogPostMutation();
  const { mutate: publishBlogPostMutation, isPending: isPendingPublish, isError: isPublishError, error: publishError } = usePublishBlogPostMutation();
  const { mutate: unpublishBlogPostMutation, isPending: isPendingUnpublish, isError: isUnpublishError, error: unpublishError } = useUnpublishBlogPostMutation();

  if (isPending || isFetching) {
    return (<LoadingContainer />);
  }

  if (isError && blogpostError) {
    return (
      <Row>
        <Col>
          <h5>{t('failPost')}</h5>
          <p>{blogpostError.message}</p>
        </Col>
      </Row>
    );
  }

  const selectedTitle = `'${blogPost.titleEn}' | '${blogPost.titleSi}'`;

  const handleDeleteBlogPost = async () => {
    deleteBlogPostMutation(blogPost.id);
    setDeleteModalShow(false);
    router.replace('/dashboard/blog');
  }

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
              variant={blogPost.status === DocumentStatus.ACTIVE ? `warning` : `success`}
              className="me-2"
              onClick={blogPost.status === DocumentStatus.ACTIVE ? handleUnpublish : handlePublish}
              disabled={isPendingPublish || isPendingUnpublish}
            >
              <FontAwesomeIcon
                icon={blogPost.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                className="list-icon"
              />{" "}
              {blogPost.status === DocumentStatus.ACTIVE ? t('unpublish') : t('publish')}
            </Button>
            <Button
              variant="danger"
              className="me-2"
              onClick={() => setDeleteModalShow(true)}
              disabled={isPendingDelete}
            >
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
        <DeleteModal
          title={t('deleteModalTitle')}
          description={
            t.rich('deleteModalMessage', {
              strong: () => <strong>{selectedTitle}</strong>,
            })
          }
          cancelText={t('deleteModalCancel')}
          confirmText={t('deleteModalAccept')}
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
          onConfirm={handleDeleteBlogPost}
        />
      </Container>
    </>
  )
}

export default BlogPostOptionsViewer;