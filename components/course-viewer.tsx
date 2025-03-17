"use client";
import React from 'react';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { useLocale, useTranslations } from 'next-intl';
import CourseView from '@/interfaces/i-course-view';
import { Link } from '@/i18n/routing';
import SharePanel from './SharePanel';
import SanitizedHtml from './sanitized-html';
import 'react-quill/dist/quill.snow.css';
import "./course-viewer.scss";

const baseTPath = 'components.CourseViewer';

interface CourseViewerProps {
  courseView: CourseView;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ courseView }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
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
                <SanitizedHtml html={courseView.description} className="ql-editor" />
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