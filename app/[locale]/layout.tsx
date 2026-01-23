import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Montserrat, Noto_Sans_Sinhala } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import NavigationBar from "@/components/NavigationBar";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';
import ClerkThemeProvider from "@/contexts/clerk-theme-provider";
import { getClerkLocalization } from "@/utils/server/clerk-localization";
import { QueryProvider } from "@/contexts/query-provider";
import { SideBarProvider } from "@/contexts/side-bar-provider";
import { routing } from "@/i18n/routing";
import notFound from "./not-found";

const montserrat = Montserrat({ subsets: ["latin"] });
const notoSansSinhala = Noto_Sans_Sinhala({ subsets: ["sinhala", "latin"] });
const GA_ID = `${process.env.NEXT_PUBLIC_GA_ID}`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export async function generateMetadata ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
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
 
export default async function LocaleLayout({ children, params }: Props) {
  const {locale} = await params;

   if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const langFontClass = locale === 'en' ? `${montserrat.className}` : `${notoSansSinhala.className}`;
  const localization = await getClerkLocalization(locale);
 
  return (
    <html lang={locale}>
      <body className={`${langFontClass}`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ClerkThemeProvider localization={localization}>
              <QueryProvider>
                <SideBarProvider>
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
                </SideBarProvider>
              </QueryProvider>
            </ClerkThemeProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={`${GA_ID}`} />
    </html>
  );
}