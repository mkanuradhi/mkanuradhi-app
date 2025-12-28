'use client';
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
import { useParams } from 'next/navigation';

type ClerkThemeProviderProps = {
  localization: any;
  children: React.ReactNode;
};

export default function ClerkThemeProvider({
  localization,
  children,
}: ClerkThemeProviderProps) {
  const { theme } = useTheme();
  const params = useParams();
  const locale = params.locale as string || 'en';

  const clerkAppearance = theme === 'dark' ? { baseTheme: dark } : undefined;

  return (
    <ClerkProvider
      localization={localization}
      appearance={clerkAppearance}
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
    >
      {children}
    </ClerkProvider>
  );
}