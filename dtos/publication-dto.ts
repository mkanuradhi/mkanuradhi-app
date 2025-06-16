import DocumentStatus from "../enums/document-status";
import PublicationType from "../enums/publication-type";
import PublicationStatus from "../enums/publication-status";
import { VersionDto } from "./base-dto";

interface PublicationAuthorDto {
	name: string;
	affiliation: string;
	profileUrl: string;
	isMe: boolean;
	corresponding: boolean;
}

export interface ActivationPublicationDto {
	status: DocumentStatus;
}

export interface CreatePublicationDto {
	type: PublicationType;
	year: number;
	title: string;
	source: string;
	authors: PublicationAuthorDto[];
	publicationStatus: PublicationStatus;
	tags: string[];
	keywords: string[];
	publicationUrl: string;
	pdfUrl: string;
	doiUrl: string;
	preprintUrl: string;
	slidesUrl: string;
	abstract: string;
	bibtex: string;
	ris: string;
	publishedDate?: Date | null;
}

export interface UpdatePublicationDto extends CreatePublicationDto, VersionDto {
}
