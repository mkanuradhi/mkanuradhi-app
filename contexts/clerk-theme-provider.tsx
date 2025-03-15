'use client';
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'

type ClerkThemeProviderProps = {
  localization: any;
  children: React.ReactNode;
};

export default function ClerkThemeProvider({
  localization,
  children,
}: ClerkThemeProviderProps) {
  const { theme } = useTheme();

  const clerkAppearance = theme === 'dark' ? { baseTheme: dark } : undefined;

  return (
    <ClerkProvider localization={localization} appearance={clerkAppearance}>
      {children}
    </ClerkProvider>
  );
}