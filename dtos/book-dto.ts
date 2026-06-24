import { BookAuthorRole, BookIsbnFormat, BookLanguage } from "@/enums/book-enums";
import { LocalizedString } from "@/types/locale.types";

export interface BookAuthorDto {
  name: LocalizedString;
  role: BookAuthorRole;
  profileUrl?: string;
}

export interface BookIsbnDto {
  format: BookIsbnFormat;
  value: string;
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
  isbns?:        BookIsbnDto[];
  pages?:        number;
  tags:          string[];

  buyLink?:      string;
  featured:      boolean;
  displayOrder?: number;
}

export interface UpdateBookDto {
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
  isbns?:        BookIsbnDto[];
  pages?:        number;
  tags:          string[];

  buyLink?:       string;
  featured:      boolean;
  displayOrder?:  number;

  v: number;    // always required — never optional
}

export interface ActivationBookDto {
  status: string;
}
