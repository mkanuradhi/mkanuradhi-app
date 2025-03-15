"use client";
import React from 'react';
import { Link } from "@/i18n/routing";
import CourseView from "@/interfaces/i-course-view";
import { Card } from "react-bootstrap";
import { useTranslations } from 'next-intl';

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
  );
};

export default CourseCard;