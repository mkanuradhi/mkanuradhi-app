"use client";
import React from 'react';
import { useRouter } from '@/i18n/routing';
import MediaContribution from '@/interfaces/i-media-contribution';
import NewMediaContributionForm from './new-media-contribution-form';

const NewMediaContributionFormContainer = () => {
  const router = useRouter();

  const handleSuccess = (createdMediaContribution: MediaContribution) => {
    router.push(`/dashboard/media-contributions/${createdMediaContribution.id}`);
  };

  return <NewMediaContributionForm onSuccess={handleSuccess} />;
};

export default NewMediaContributionFormContainer;