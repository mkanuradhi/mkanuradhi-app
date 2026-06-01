"use client";
import React from 'react';
import { useRouter } from '@/i18n/routing';
import NewBookForm from './new-book-form';
import Book from '@/interfaces/i-book';

const NewBookFormContainer = () => {
  const router = useRouter();

  const handleSuccess = (createdBook: Book) => {
    router.push(`/dashboard/books/${createdBook.id}`);
  };

  return <NewBookForm onSuccess={handleSuccess} />;
};

export default NewBookFormContainer;