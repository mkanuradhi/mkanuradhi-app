import React from 'react';
import { ApiError } from '@/errors/api-error';
import { notFound } from 'next/navigation';
import { LANG_EN, LANG_SI } from '@/constants/common-vars';
import { getLocalizedBookByPath } from '@/services/book-service';
import BookViewer from '@/components/book-viewer';

export const revalidate = 604800; // cache for 1 week

interface BookPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata ({ params }: BookPageProps) {
  const { locale, slug } = params;
  
  const localizedBook = await getLocalizedBookByPath(locale, slug);

  return {
    title: localizedBook.title,
    description: localizedBook.description,
    keywords: localizedBook.tags,
    authors: [{ name: 'Anuradha Ariyaratne' }],
    creator: 'Anuradha',
    publisher: 'M K A Ariyaratne',
    alternates: {
      canonical: `/${locale}/books/${slug}`,
      languages: {
        en: `/${LANG_EN}/books/${slug}`,
        si: `/${LANG_SI}/books/${slug}`,
      },
    },
    openGraph: {
      title: localizedBook.title,
      description: localizedBook.subtitle,
      type: 'article',
      siteName: 'mkanuradhi',
      locale: locale === LANG_SI ? 'si_LK' : 'en_US',
      url: `/${locale}/books/${slug}`,
      // no images[] here — opengraph-image.tsx supplies it automatically
    },
    // no twitter block needed either — same file supplies twitter:image too
  };
};

const BookPage: React.FC<BookPageProps> = async ({ params }) => {
  const { locale, slug } = params;
  let localizedBook;
  try {
    localizedBook = await getLocalizedBookByPath(locale, slug);
  } catch (error: any) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <div className="book">
        <BookViewer localizedBook={localizedBook} />
      </div>
    </>
  );
}

export default BookPage;