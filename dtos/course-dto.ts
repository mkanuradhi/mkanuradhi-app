import DeliveryMode from "@/enums/delivery-mode";
import { VersionDto } from "./base-dto";
import DegreeType from "@/enums/degree-type";

export interface CreateCourseEnDto {
  year: number;
  degreeType: DegreeType;
  code?: string;
  credits?: number | undefined;
  mode: DeliveryMode;
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
