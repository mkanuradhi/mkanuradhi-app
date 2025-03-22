import React from 'react';
import CourseOptionsViewer from '@/components/course-options-viewer';

interface CourseOptionsPageProps {
  params: {
    courseId: string;
  };
}

const CourseOptionsPage: React.FC<CourseOptionsPageProps> = ({ params }) => {
  const { courseId } = params;

  return (
    <>
      <CourseOptionsViewer courseId={courseId} />
    </>
  );
}

export default CourseOptionsPage;