"use client";
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useTheme } from '@/hooks/useTheme';
import ReCAPTCHA from 'react-google-recaptcha';

// Define the interface for the component's exposed methods
export interface RecaptchaCheckboxRef {
  resetRecaptcha: () => void;
}

interface RecaptchaCheckboxProps {
  onVerify: (token: string | null) => void;
}

const RecaptchaCheckbox = forwardRef<RecaptchaCheckboxRef, RecaptchaCheckboxProps>(({ onVerify }, ref) => {
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useImperativeHandle(ref, () => ({
    resetRecaptcha() {
      if (recaptchaRef.current) {
        recaptchaRef.current?.reset();
        setReady(false);
        onVerify(null);
      }
    }
  }), [onVerify]);

  return (
    <>
      <ReCAPTCHA
        ref={recaptchaRef}
        key={theme}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        theme={theme}
        size="normal"
        onChange={(token: string | null) => {
          setReady(!!token);
          onVerify(token);
        }}
        onErrored={() => setReady(false)}
        onExpired={() => setReady(false)}
      />
    </>
  );
});

RecaptchaCheckbox.displayName = 'RecaptchaCheckbox';

export default RecaptchaCheckbox;