import { MediaContributionLanguage, MediaContributionRole, MediaContributionType } from "@/enums/media-contribution-enums";
import { LocalizedString } from "@/types/locale.types";

export interface mediaContributionAuthorDto {
  name:        LocalizedString;
  isMe:        boolean;
  profileUrl?: string;
}

export interface mediaContributionInterviewerDto {
  name:       LocalizedString;
  profileUrl: string;
}

export interface mediaContributionOutletDto {
  name:   LocalizedString;
  webUrl: string;
}

export interface CreateMediaContributionDto {
  title:             LocalizedString;
  titleOriginal:     string;
  subtitle?:         LocalizedString;
  subtitleOriginal?: string;
  description:       LocalizedString;
  content?:          LocalizedString;

  type: MediaContributionType;
  role: MediaContributionRole;
  
  topics:        LocalizedString[];
  authors?:      mediaContributionAuthorDto[],
  language:      MediaContributionLanguage;
  interviewers?: mediaContributionInterviewerDto[];

  outlet?:          mediaContributionOutletDto;
  publishedDate:    Date;
  durationSeconds?: number;
  highlightQuote?:  LocalizedString;

  sourceUrl?:   string;
  featured:     boolean;
  displayOrder: number;
}

export interface updateMediaContributionAuthorDto {
  id:          string;
  name:        LocalizedString;
  isMe:        boolean;
  profileUrl?: string;
}

export interface updateMediaContributionInterviewerDto {
  id:         string;
  name:       LocalizedString;
  profileUrl: string;
}

export interface updateMediaContributionPreviewImageDto {
  id:           string;
  caption?:     LocalizedString;
  displayOrder: number;
}

export interface updateMediaContributionDto {
  title:             LocalizedString,
  titleOriginal:     string,
  subtitle?:         LocalizedString;
  subtitleOriginal?: string;
  description:       LocalizedString;
  content?:          LocalizedString;

  type: MediaContributionType;
  role: MediaContributionRole;

  topics:        LocalizedString[];
  authors?:      updateMediaContributionAuthorDto[],
  language:      MediaContributionLanguage;
  interviewers?: updateMediaContributionInterviewerDto[];

  outlet?:          mediaContributionOutletDto;
  publishedDate:    Date;
  durationSeconds?: number;
  highlightQuote?:  LocalizedString;
  previewImages?:   updateMediaContributionPreviewImageDto[];

  sourceUrl?:   string;
  featured:     boolean;
  displayOrder: number;

  v: number;    // always required — never optional
}

export interface ActivationMediaContributionDto {
  status: string;
}
