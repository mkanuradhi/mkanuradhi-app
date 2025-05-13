import DocumentStatus from "../enums/document-status";
import PublicationType from "../enums/publication-type";
import PublicationStatus from "../enums/publication-status";
import { VersionDto } from "./base-dto";

interface PublicationAuthorDto {
  name: string;
  isMe: boolean; 
}

export interface ActivationPublicationDto {
  status: DocumentStatus;
}

export interface CreatePublicationDto {
  type: PublicationType;
	year: number;
	title: string;
	description: string;
  source: string;
	authors: PublicationAuthorDto[];
	publicationStatus: PublicationStatus;
	tags: string[];
	publicationUrl: string;
	pdfUrl: string;
	doiUrl: string;
	arxivUrl: string;
	bibtex: string;
}

export interface UpdatePublicationDto extends CreatePublicationDto, VersionDto {
}
