import "./globals.scss";

export async function generateMetadata () {

  return {
    title: {
      template: `%s - M K A Ariyaratne`,
      default: `M K A Ariyaratne`,
    },
    description: '',
    keywords: '',
    openGraph: {
      title: 'M K A Ariyaratne',
      description: '',
      url: "https://mkanuradhi.vercel.app",
      siteName: 'mkanuradhi',
      type: 'website',
      locale: 'en_US',
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
 
export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <>
      {children}
    </>
  );
}