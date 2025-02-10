import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Montserrat, Noto_Serif_Sinhala } from "next/font/google";
import { ThemeProvider } from "../contexts/ThemeProvider";
import NavigationBar from "../components/NavigationBar";
import { Footer } from "../components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';

const montserrat = Montserrat({ subsets: ["latin"] });
const notoSerifSinhala = Noto_Serif_Sinhala({ subsets: ["latin", "sinhala"] });
const GA_ID = `${process.env.NEXT_PUBLIC_GA_ID}`;

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: '' });

  return {
    title: {
      template: `%s - ${t('title')}`,
      default: `${t('title')}`,
    },
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: {
        template: `%s - ${t('title')}`,
        default: `${t('title')}`,
      },
      description: t('description'),
      url: "https://www.mkanuradhi.com",
      siteName: 'mkanuradhi',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/images/mkanuradhi.png',
          width: 1200,
          height: 630,
          alt: 'MKA',
        },
        {
          url: '/images/mkanuradhis.png',
          width: 600,
          height: 314,
          alt: 'MKA',
        },
      ],
    }
  };
};
 
export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {

  const messages = await getMessages();
  const langFontClass = locale === 'en' ? `${montserrat.className}` : `${notoSerifSinhala.className}`;
 
  return (
    <html lang={locale}>
      <body className={`${langFontClass}`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="background-container">
              <div className="overlay"></div>
              <div className="background-image bg1"></div>
              <div className="background-image bg2"></div>
            </div>
            <div className="app">
              <header>
                <NavigationBar />
              </header>
              <main>
                {children}
              </main>
              <footer>
                <Footer />
              </footer>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={`${GA_ID}`} />
    </html>
  );
}