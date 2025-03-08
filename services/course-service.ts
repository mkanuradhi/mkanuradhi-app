import { API_BASE_URL, COURSES_PATH } from "@/constants/api-paths";
import { CreateCourseEnDto, UpdateCourseEnDto, UpdateCourseSiDto } from "@/dtos/course-dto";
import DocumentStatus from "@/enums/document-status";
import { handleApiError } from "@/errors/api-error-handler";
import Course from "@/interfaces/i-course";
import CourseView from "@/interfaces/i-course-view";
import PaginatedResult from "@/interfaces/i-paginated-result";
import axios from "axios";

export const getCourses = async (page: number, size: number): Promise<PaginatedResult<Course>> => {
  try {
    const response = await axios.get<PaginatedResult<Course>>(`${API_BASE_URL}${COURSES_PATH}`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const response = await axios.get<Course>(`${API_BASE_URL}${COURSES_PATH}/id/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCourseByPath = async (lang: string, path: string): Promise<CourseView> => {
  try {
    const response = await axios.get<CourseView>(`${API_BASE_URL}${COURSES_PATH}/path/${path}`, {
      params: {
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getActivatedCourses = async (lang: string, page: number, size: number): Promise<PaginatedResult<CourseView>> => {
  try {
    const response = await axios.get<PaginatedResult<CourseView>>(`${API_BASE_URL}${COURSES_PATH}/search`, {
      params: {
        q: '',
        page,
        size,
        status: DocumentStatus.ACTIVE,
        sort: 'latest',
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activateCourse = async (id: string): Promise<Course> => {
  try {
    const response = await axios.patch<Course>(
      `${API_BASE_URL}${COURSES_PATH}/${id}/toggle`,
      { status: DocumentStatus.ACTIVE }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateCourse = async (id: string): Promise<Course> => {
  try {
    const response = await axios.patch<Course>(
      `${API_BASE_URL}${COURSES_PATH}/${id}/toggle`,
      { status: DocumentStatus.INACTIVE }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${COURSES_PATH}/${id}`);
    if (response.status !== 204) {
      throw new Error('Failed to delete course');
    }
    return { id, message: 'Course deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createCourseEn = async (courseEnDto: CreateCourseEnDto): Promise<Course> => {
  try {
    const response = await axios.post<Course>(
      `${API_BASE_URL}${COURSES_PATH}`,
      courseEnDto
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCourseSi = async (id: string, courseSiDto: UpdateCourseSiDto): Promise<Course> => {
  try {
    const response = await axios.patch<Course>(
      `${API_BASE_URL}${COURSES_PATH}/${id}/si`,
      courseSiDto
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCourseEn = async (id: string, courseEnDto: UpdateCourseEnDto): Promise<Course> => {
  try {
    const response = await axios.patch<Course>(
      `${API_BASE_URL}${COURSES_PATH}/${id}/en`,
      courseEnDto
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
