import React from 'react';
import { getTranslations } from 'next-intl/server';
import 'react-toastify/dist/ReactToastify.css';
import ContactForm from '@/app/components/ContactForm';

const baseTPath = 'pages.Contact';

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords: t('pageKeywords'),
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      type: 'website',
      images: [
        {
          url: '',
          width: 800,
          height: 600,
          alt: 'MKA',
        },
      ],
    }
  };
};

const ContactPage = () => {

  return (
    <>
      <div className="contact">
        <ContactForm />
      </div>
    </>
  )
}

export default ContactPage;