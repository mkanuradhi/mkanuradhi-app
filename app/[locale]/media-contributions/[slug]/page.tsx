import React from 'react';
import { ApiError } from '@/errors/api-error';
import { notFound } from 'next/navigation';
import { LANG_EN, LANG_SI } from '@/constants/common-vars';
import { getLocalizedMediaContributionByPath } from '@/services/media-contribution-service';
import MediaContributionViewer from '@/components/media-contribution-viewer';

export const revalidate = 604800; // cache for 1 week

interface MediaContributionPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata ({ params }: MediaContributionPageProps) {
  const { locale, slug } = params;
  
  const localizedMediaContribution = await getLocalizedMediaContributionByPath(locale, slug);

  return {
    title: localizedMediaContribution.title,
    description: localizedMediaContribution.description,
    keywords: localizedMediaContribution.topics?.join(', '),
    authors: [{ name: 'Anuradha Ariyaratne' }],
    creator: 'Anuradha',
    publisher: 'M K A Ariyaratne',
    alternates: {
      canonical: `/${locale}/media-contributions/${slug}`,
      languages: {
        en: `/${LANG_EN}/media-contributions/${slug}`,
        si: `/${LANG_SI}/media-contributions/${slug}`,
      },
    },
    openGraph: {
      title: localizedMediaContribution.title,
      description: localizedMediaContribution.subtitle,
      type: 'article',
      siteName: 'mkanuradhi',
      locale: locale === LANG_SI ? 'si_LK' : 'en_US',
      url: `/${locale}/books/${slug}`,
      // no images[] here — opengraph-image.tsx supplies it automatically
    },
    // no twitter block needed either — same file supplies twitter:image too
  };
};

const MediaContributionPage: React.FC<MediaContributionPageProps> = async ({ params }) => {
  const { locale, slug } = params;
  let localizedMediaContribution;
  try {
    localizedMediaContribution = await getLocalizedMediaContributionByPath(locale, slug);
  } catch (error: any) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <div className="book">
        <MediaContributionViewer localizedMediaContribution={localizedMediaContribution} />
      </div>
    </>
  );
}

export default MediaContributionPage;