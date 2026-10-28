"use client";
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useLocale, useTranslations } from 'next-intl';
import CourseView from '@/interfaces/i-course-view';
import SharePanel from './SharePanel';
import SanitizedHtml from './sanitized-html';
import GlowLink from './GlowLink';
import PageTrail from './page-trail';
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
            <Row className='mb-4'>
              <Col>
                <PageTrail
                  items={[
                    { label: t('teaching'), href: "/teaching" },
                    { label: t('courses'), href: "/teaching/courses" },
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <h5>{courseView.year}</h5>
                {codeCredits && (
                  <h4 className="text-muted">{codeCredits}</h4>
                )}
                <div>
                  <h1>{courseView.title}</h1>
                  {courseView.subtitle && (
                    <h6>{`(${courseView.subtitle})`}</h6>
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
            {courseView.quizzes && courseView.quizzes.length > 0 && (
              <Row className="">
                <Col>
                  <h2 className="my-3">{t('quizzes')}</h2>
                  <div>
                    <span className="me-2">{t('ready')}</span>
                    <span>
                      <GlowLink href={`${courseView.path}/quizzes`}>
                        {
                          t.rich('quizzesLink', {
                            count: `${courseView.quizzes.length} ${t('countSuffix')}`,
                            quizzesWord: courseView.quizzes.length > 1 ? t('quizzesWord') : t('quizWord'),
                          })
                        }
                      </GlowLink>
                    </span>
                  </div>
                </Col>
              </Row>
            )}
            <hr />
            <Row className="my-4">
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