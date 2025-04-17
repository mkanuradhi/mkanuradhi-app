import CourseView from './i-course-view';

export interface LocationGroup {
  location: string;
  courses: CourseView[];
}

export interface GroupedCourses {
  year: number;
  locations: LocationGroup[];
}