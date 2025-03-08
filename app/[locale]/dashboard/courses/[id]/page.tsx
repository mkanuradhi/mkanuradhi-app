import React from 'react';
import CourseOptionsViewer from '@/components/course-options-viewer';

interface CourseOptionsPageProps {
  params: {
    id: string;
  };
}

const CourseOptionsPage: React.FC<CourseOptionsPageProps> = ({ params }) => {
  const { id } = params;

  return (
    <>
      <div className="course">
        <CourseOptionsViewer courseId={id} />
      </div>
    </>
  );
}

export default CourseOptionsPage;