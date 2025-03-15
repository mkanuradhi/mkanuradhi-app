"use client";
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { useLocale, useTranslations } from 'next-intl';
import CourseView from '@/interfaces/i-course-view';
import { Link } from '@/i18n/routing';
import SharePanel from './SharePanel';
import "./course-viewer.scss";

const baseTPath = 'components.CourseViewer';

interface CourseViewerProps {
  courseView: CourseView;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ courseView }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const fullUrl = `${baseUrl}/${locale}/teaching/courses/${courseView.path}`;

  const codeCreditsParts: string[] = [];
  if (courseView.code) {
    codeCreditsParts.push(courseView.code);
  }
  if (courseView.credits) {
    const formattedCredits = courseView.credits ? courseView.credits.toFixed(1) : courseView.credits;
    codeCreditsParts.push(`${t.rich('credits', {value: formattedCredits})}`);
  }
  const codeCredits = codeCreditsParts.join(" | ");

  useEffect(() => {
    // Add a hook to handle target="_blank"
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });

    const sanitizedDescription = DOMPurify.sanitize(courseView.description, {
      ALLOWED_ATTR: ['target', 'href', 'rel', 'src', 'alt', 'style'], // Include necessary attributes
    });
    setSanitizedHtml(sanitizedDescription);
    
    return () => {
      DOMPurify.removeHook('afterSanitizeAttributes');
    }
  }, [courseView.description]);

  return (
    <>
      <Container fluid="md" className="course-viewer">
        <Row className="my-4">
          <Col>
            <Row>
              <Col>
                <Breadcrumb>
                  <Breadcrumb.Item linkAs="span">
                    <Link href="/">{t('home')}</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item linkAs="span">
                    <Link href="/teaching">{t('teaching')}</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item linkAs="span">
                    <Link href="/teaching/courses">{t('courses')}</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            <Row>
              <Col>
                <h5>{courseView.year}</h5>
                {codeCredits && (
                  <h4 className="text-muted">{codeCredits}</h4>
                )}
                <div className="d-flex align-items-baseline">
                  <span className="h1 mb-0 me-3">{courseView.title}</span>
                  {courseView.subtitle && (
                    <span className="h5 mb-0">{`(${courseView.subtitle})`}</span>
                  )}
                </div>
                <hr className="divider" />
              </Col>
            </Row>
            <Row>
              <Col>
                <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
              </Col>
            </Row>
            <Row className="my-3">
              <Col>
                <h6>{t('share')}</h6>
                <SharePanel
                  title={courseView.title}
                  url={fullUrl}
                  description={courseView.title}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default CourseViewer;