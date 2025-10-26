"use client";
import React from 'react';
import { Link } from "@/i18n/routing";
import CourseView from "@/interfaces/i-course-view";
import { Card } from "react-bootstrap";
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const baseTPath = 'components.CourseCard';

interface CourseCardProps {
  course: CourseView;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const t = useTranslations(baseTPath);

  const codeCreditsParts: string[] = [];
  if (course.code) {
    codeCreditsParts.push(course.code);
  }
  if (course.credits) {
    const formattedCredits = course.credits ? course.credits.toFixed(1) : course.credits;
    codeCreditsParts.push(`${t.rich('credits', {value: formattedCredits})}`);
  }
  const codeCredits = codeCreditsParts.join(" | ");

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: '0px 12px 30px rgba(var(--bs-body-color-rgb), 0.2)'
      }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20
      }}
    >
      <Card className="h-100">
        <Card.Body>
          <Card.Title>
            <Link href={`/teaching/courses/${course.path}`} className="stretched-link text-decoration-none">
              {course.title}
            </Link>
          </Card.Title>
          {codeCredits && (
            <Card.Subtitle className="mb-2 text-muted">
              {codeCredits}
            </Card.Subtitle>
          )}
          <Card.Text>
            {course.subtitle}
          </Card.Text>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default CourseCard;