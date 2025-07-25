import DeliveryMode from "@/enums/delivery-mode";
import DocumentStatus from "../enums/document-status";
import DegreeType from "@/enums/degree-type";

interface CourseQuiz {
  id: string;
  titleEn: string;
  titleSi: string;
}

interface Course {
  id: string;
  year: number;
  degreeType: DegreeType;
  code: string;
  credits: number;
  mode: DeliveryMode;
  titleEn: string;
  subtitleEn: string;
  descriptionEn: string;
  locationEn: string;
  titleSi: string;
  subtitleSi: string;
  descriptionSi: string;
  locationSi: string;
  path: string;
  quizzes: CourseQuiz[];
  status: DocumentStatus;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  v: number;
}

export default Course;