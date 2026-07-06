import React from 'react';
import BookOptionsViewer from '@/components/book-options-viewer';

interface BookOptionsPageProps {
  params: {
    bookId: string;
  };
}

const BookOptionsPage: React.FC<BookOptionsPageProps> = ({ params }) => {
  const { bookId } = params;

  return (
    <>
      <BookOptionsViewer bookId={bookId} />
    </>
  );
}

export default BookOptionsPage;