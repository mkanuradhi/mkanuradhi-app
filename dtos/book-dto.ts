import { BookAuthorRole, BookLanguage } from "@/enums/book-enums";
import { LocalizedString } from "@/types/locale.types";

export interface BookAuthorDto {
  name: LocalizedString;
  role: BookAuthorRole;
  profileUrl?: string;
}

export interface CreateBookDto {
  title:       LocalizedString;
  subtitle?:   LocalizedString;
  description: LocalizedString;
  content:     LocalizedString;
  subject:     LocalizedString[];
  authors:     BookAuthorDto[];
  writtenLang: BookLanguage;

  publisher:     LocalizedString;
  publishedYear: number;
  edition?:      string;
  isbn?:         string;
  pages?:        number;
  tags:          string[];

  coverImage?:   string;
  previewImages: string[];
  buyLink?:      string;
  pdfTeaser?:    string;

  featured:      boolean;
  displayOrder?: number;
}

export interface ActivationBookDto {
  status: string;
}

