import * as yup from 'yup';
import {
  MAX_RESEARCH_ABSTRACT_LENGTH,
  MAX_RESEARCH_LOCATION_LENGTH,
  MAX_RESEARCH_TITLE_LENGTH,
  MAX_RESEARCH_URL_LENGTH,
  MAX_RESEARCH_YEAR,
  MIN_RESEARCH_LOCATION_LENGTH,
  MIN_RESEARCH_TITLE_LENGTH,
  MIN_RESEARCH_YEAR,
} from '@/constants/validation-vars';
import DegreeType from '@/enums/degree-type';
import SupervisorRole from '@/enums/supervisor-role';
import SupervisionStatus from '@/enums/supervision-status';

export const getNewResearchSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    type: yup.string()
      .oneOf(Object.values(DegreeType), t('typeInvalid'))
      .required(t('typeRequired')),
    degree: yup.string()
      .required(t('degreeRequired'))
      .min(MIN_RESEARCH_TITLE_LENGTH, t('degreeTooShort', { min: MIN_RESEARCH_TITLE_LENGTH }) )
      .max(MAX_RESEARCH_TITLE_LENGTH, t('degreeTooLong', { max: MAX_RESEARCH_TITLE_LENGTH })),
    completedYear: yup.number()
      .transform((value, originalValue) => {
        const trimmed = typeof originalValue === 'string' ? originalValue.trim() : originalValue;
        return trimmed === '' ? null : value;
      })
      .nullable()
      .notRequired()
      .typeError(t('yearMustBeNumber'))
      .integer(t('yearMustBeAnInteger'))
      .min(MIN_RESEARCH_YEAR, t('yearTooLow', { min: MIN_RESEARCH_YEAR }))
      .max(MAX_RESEARCH_YEAR, t('yearTooHigh', { max: MAX_RESEARCH_YEAR }))
      .test('validYearLength', t('yearInvalid'), value => {
        if (value === undefined || value === null) return true; // allow empty
        return /^\d{4}$/.test(value.toString());
      })
      .test(
        'requiredIfCompletedDate',
        t('yearRequiredWithCompletedDate'),
        function (value) {
          const { completedDate } = this.parent;
          if (completedDate && (value === undefined || value === null)) {
            return false;
          }
          return true;
        }
      ),
    title: yup.string()
      .min(MIN_RESEARCH_TITLE_LENGTH, t('titleTooShort', { min: MIN_RESEARCH_TITLE_LENGTH }) )
      .max(MAX_RESEARCH_TITLE_LENGTH, t('titleTooLong', { max: MAX_RESEARCH_TITLE_LENGTH }) )
      .required(t('titleRequired')),
    location: yup.string()
      .min(MIN_RESEARCH_LOCATION_LENGTH, t('locationTooShort', { min: MIN_RESEARCH_LOCATION_LENGTH }) )
      .max(MAX_RESEARCH_LOCATION_LENGTH, t('locationTooLong', { max: MAX_RESEARCH_LOCATION_LENGTH }) ),
    abstract: yup.string()
      .notRequired()
      .max(MAX_RESEARCH_ABSTRACT_LENGTH, t('abstractTooLong', { max: MAX_RESEARCH_ABSTRACT_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    supervisors: yup.array()
      .of(
        yup.object({
          name: yup.string().trim().required(t('supervisorNameRequired')),
          affiliation: yup.string().nullable(),
          profileUrl: yup.string().url(t('urlMustBeValid')).nullable(),
          isMe: yup.boolean(),
          role: yup.string()
            .oneOf(Object.values(SupervisorRole), t('supervisorRoleInvalid')),
        })
      )
      .min(1, t('supervisorsRequired'))
      .test(
        'unique-supervisors',
        t('supervisorsMustBeUnique'),
        (supervisors) => {
          if (!Array.isArray(supervisors)) return true;
          const names = supervisors.map(a => (a?.name ?? '').trim().toLowerCase());
          const duplicates = names.filter((name, idx) => names.indexOf(name) !== idx);
          return duplicates.length === 0;
        }
      )
      .test('valid-isMeWithIsMine', t('supervisorCannotIsMe'), function (supervisors) {
        const { isMine } = this.parent;
        if (!Array.isArray(supervisors)) return true;
        if (isMine) {
          const count = supervisors.filter(s => s.isMe).length;
          return count === 0;
        }
        return true;
      })
      .test('valid-isMeWithoutIsMine', t('supervisorExactlyOneIsMe'), function (supervisors) {
        const { isMine } = this.parent;
        if (!Array.isArray(supervisors)) return true;
        if (!isMine) {
          const count = supervisors.filter(s => s.isMe).length;
          return count === 1; // should have exactly one supervisor marked as isMe
        }
        return true;
      }),
    keywords: yup.array()
      .of(yup.string().trim())
      .transform((value, originalValue) =>
        Array.isArray(originalValue)
          ? originalValue.filter(v => v && v.trim() !== '')
          : []
      ),
    thesisUrl: yup.string()
      .url(t('urlMustBeValid'))
      .nullable()
      .notRequired()
      .max(MAX_RESEARCH_URL_LENGTH, t('urlTooLong', { max: MAX_RESEARCH_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    githubUrl: yup.string()
      .url(t('urlMustBeValid'))
      .notRequired()
      .max(MAX_RESEARCH_URL_LENGTH, t('urlTooLong', { max: MAX_RESEARCH_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    slidesUrl: yup.string()
      .url(t('urlMustBeValid'))
      .notRequired()
      .max(MAX_RESEARCH_URL_LENGTH, t('urlTooLong', { max: MAX_RESEARCH_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    studentName: yup.string()
      .notRequired()
      .max(MAX_RESEARCH_TITLE_LENGTH, t('studentNameTooLong', { max: MAX_RESEARCH_TITLE_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      })
      .test('studentNameRequiredIfNotMine', t('studentNameRequired'), function (value) {
        const { isMine } = this.parent;
        if (isMine === false) {
          return !!value && value.trim() !== '';
        }
        return true;
      }),
    supervisionStatus: yup.string()
      .oneOf(Object.values(SupervisionStatus), t('supervisionStatusInvalid'))
      .required(t('supervisionStatusRequired')),
    registrationNumber: yup.string()
      .notRequired()
      .max(MAX_RESEARCH_TITLE_LENGTH, t('registrationNumberTooLong', { max: MAX_RESEARCH_TITLE_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    startedDate: yup.date()
      .nullable()
      .notRequired()
      .min(new Date(`${MIN_RESEARCH_YEAR}-01-01`), t('startedDateTooEarly', { min: MIN_RESEARCH_YEAR }))
      .max(new Date(), t('startedDateCannotBeInFuture'))
      .typeError(t('startedDateInvalid'))
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    completedDate: yup.date()
      .nullable()
      .notRequired()
      .min(new Date(`${MIN_RESEARCH_YEAR}-01-01`), t('completedDateTooEarly', { min: MIN_RESEARCH_YEAR }))
      .max(new Date(), t('completedDateCannotBeInFuture'))
      .typeError(t('completedDateInvalid'))
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      })
      .test('completedAfterStarted', t('completedDateMustBeAfterStarted'), function (value) {
        const { startedDate } = this.parent;
        if (!value || !startedDate) return true; // skip check if one is not provided
        return value > startedDate;
      }),
    isMine: yup.boolean(),
  });
};
