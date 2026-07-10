"use client";
import "./book-subjects-list.scss";

interface BookSubjectsListProps {
  subjects: string[];
}

const BookSubjectsList: React.FC<BookSubjectsListProps> = ({ subjects }) => {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div className="subject-pill-list">
      {subjects.map((subject, index) => (
        <span key={index} className="subject-pill">
          {subject}
        </span>
      ))}
    </div>
  );
};

export default BookSubjectsList;