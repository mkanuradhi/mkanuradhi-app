"use client";
import React from 'react';
import { GroupedCourses } from '@/interfaces/i-grouped-courses';
import { useTranslations } from 'next-intl';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import CourseCard from './course-card';
import { Link } from '@/i18n/routing';
import ScrollReveal from './scroll-reveal';
import "./courses-container.scss";

const baseTPath = 'components.CoursesContainer';

interface CoursesContainerProps {
  groupedCourses: GroupedCourses[]
}

const CoursesContainer: React.FC<CoursesContainerProps> = ({ groupedCourses }) => {
  const t = useTranslations(baseTPath);

  return (
    <>
      <Container className="courses-container">
        <Row className="mt-4">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs="span">
                <Link href="/">{t('home')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href="/teaching">{t('teaching')}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>{t('title')}</h1>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            {groupedCourses.map(group => (
              <section key={group.year} className="mt-4">
                <h3>{group.year}</h3>
                {group.locations.map((locGroup, index) => (
                  <div key={index} className="mb-4">
                    <h6>{locGroup.location}</h6>
                    <Row>
                      {locGroup.courses.map((course, index) => (
                        <ScrollReveal key={course.id} className="col-md-4 mb-3" delay={index * 0.1}>
                          <CourseCard course={course} />
                        </ScrollReveal>
                      ))}
                    </Row>
                  </div>
                ))}
              </section>
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CoursesContainer;