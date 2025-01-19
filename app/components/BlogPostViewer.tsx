"use client";
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import BlogPostView from '../interfaces/i-blog-post-view';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import "./BlogPostViewer.scss";
import { Link } from '@/i18n/routing';

const baseTPath = 'components.BlogPostViewer';

interface BlogPostContentProps {
  blogPostView: BlogPostView;
}

const BlogPostViewer: React.FC<BlogPostContentProps> = ({ blogPostView }) => {
  const t = useTranslations(baseTPath);
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('');

  useEffect(() => {
    setSanitizedHtml(DOMPurify.sanitize(blogPostView.content));
  }, [blogPostView.content]);

  return (
    <>
      <Container fluid="md" className="blog-post-viewer">
        <Row className="my-4">
          <Col>
            <Row>
              <Col>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link href="/">{t('home')}</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link href="/blog">{t('blog')}</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <h1>{blogPostView.title}</h1>
                <p className="fs-7">
                  <span className="text-muted fs-7">{blogPostView.formattedDate} {blogPostView.formattedTime}</span>
                </p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <div style={{ position: 'relative', minHeight: '28rem', minWidth: '100%' }}>
                  <Image src={blogPostView.primaryImage} alt={`Image for ${blogPostView.title}`} fill={true}
                    style={{ objectFit: 'cover', }} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default BlogPostViewer;