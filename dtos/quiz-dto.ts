import { VersionDto } from "./base-dto";

export interface CreateQuizDto {
  titleEn: string;
  titleSi: string;
  duration?: number | undefined;
  availableFrom?: Date | undefined;
  availableUntil?: Date | undefined;
}

export interface UpdateQuizDto extends CreateQuizDto, VersionDto {
}
