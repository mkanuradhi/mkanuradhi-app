"use client";
import React from 'react';
import { LocalizedSummaryBook } from '@/interfaces/i-book';
import BookCard from './book-card';

interface BooksViewerProps {
  lsBooks: LocalizedSummaryBook[];
}

const BooksViewer: React.FC<BooksViewerProps> = ({lsBooks}) => {

  return (
    <>
      {lsBooks.map((lsBook, index) => {
        const isReversed = index % 2 === 1;
        return (
          <BookCard key={lsBook.path} lsBook={lsBook} reversed={isReversed} />
        );
      })}
    </>
  );
}

export default BooksViewer;