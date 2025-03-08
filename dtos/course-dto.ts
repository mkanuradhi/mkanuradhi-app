import { VersionDto } from "./base-dto";

export interface CreateCourseEnDto {
  year: number;
  code?: string;
  credits?: number;
  titleEn: string;
  subtitleEn?: string;
  descriptionEn?: string;
  locationEn: string;
  path?: string;
}

export interface UpdateCourseEnDto extends CreateCourseEnDto, VersionDto {
}

export interface UpdateCourseSiDto extends VersionDto {
  titleSi: string;
  subtitleSi: string;
  descriptionSi: string;
  locationSi: string;
}
