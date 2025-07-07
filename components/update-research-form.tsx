"use client";
import React, { useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps, FieldArray } from 'formik';
import { Col, Row, Form as BootstrapForm, Button } from 'react-bootstrap';
import { getNewResearchSchema } from '@/schemas/new-research-schema';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faMinus, faPaperPlane, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useResearchByIdQuery, useUpdateResearchMutation } from '@/hooks/use-research';
import { useRouter } from '@/i18n/routing';
import RequiredFormLabel from './required-form-label';
import Research from '@/interfaces/i-research';
import { UpdateResearchDto } from '@/dtos/research-dto';
import LoadingContainer from './loading-container';
import SupervisorRole from '@/enums/supervisor-role';
import SupervisionStatus from '@/enums/supervision-status';
import DegreeType from '@/enums/degree-type';
import RichTextEditor from './rich-text-editor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const baseTPath = 'components.NewResearchForm';

interface UpdateResearchFormProps {
  researchId: string;
  onSuccess: (research: Research) => void;
}

const UpdateResearchForm: React.FC<UpdateResearchFormProps> = ({ researchId, onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();

  const { data: research, isPending, isError, isFetching, isSuccess, error } = useResearchByIdQuery(researchId);
  const { mutateAsync: updateResearchMutation, isPending: isPendingUpdateResearch } = useUpdateResearchMutation();

  const initialValues = useMemo(() => {
      return research
        ? {
            type: research.type || DegreeType.BSC,
            degree: research.degree || '',
            completedYear: research.completedYear ? research.completedYear.toString() : '',
            title: research.title || '',
            location: research.location || '',
            abstract: research.abstract || '',
            supervisors: research.supervisors ? research.supervisors : [
              { name: '', affiliation: '', profileUrl: '', isMe: false, role: SupervisorRole.MAIN_SUPERVISOR },
            ],
            keywords: research.keywords?.length > 0 ? research.keywords : [],
            thesisUrl: research.thesisUrl || '',
            githubUrl: research.githubUrl || '',
            slidesUrl: research.slidesUrl || '',
            studentName: research.studentName || '',
            supervisionStatus: research.supervisionStatus || SupervisionStatus.IN_PROGRESS,
            registrationNumber: research.registrationNumber || '',
            startedDate: research.startedDate || undefined,
            completedDate: research.completedDate || undefined,
            isMine: research.isMine || false,
            v: research.v || 0,
          }
        : {
            type: DegreeType.BSC,
            degree: '',
            completedYear: '',
            title: '',
            location: '',
            abstract: '',
            supervisors: [
              { name: '', affiliation: '', profileUrl: '', isMe: false, role: SupervisorRole.MAIN_SUPERVISOR },
            ],
            keywords: [],
            thesisUrl: '',
            githubUrl: '',
            slidesUrl: '',
            studentName: '',
            supervisionStatus: SupervisionStatus.IN_PROGRESS,
            registrationNumber: '',
            startedDate: undefined,
            completedDate: undefined,
            isMine: false,
            v: 0,
          };
    }, [research]);

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
  ) => {
    const researchDto: UpdateResearchDto = {
      type: values.type,
      degree: values.degree,
      completedYear: values.completedYear && values.completedYear.trim() !== '' ? parseInt(values.completedYear, 10) : undefined,
      title: values.title,
      location: values.location,
      abstract: values.abstract,
      supervisors: values.supervisors,
      keywords: values.keywords,
      thesisUrl: values.thesisUrl,
      githubUrl: values.githubUrl,
      slidesUrl: values.slidesUrl,
      studentName: values.studentName,
      supervisionStatus: values.supervisionStatus,
      registrationNumber: values.registrationNumber,
      startedDate: values.startedDate ? new Date(new Date(values.startedDate).toDateString()) : undefined,
      completedDate: values.completedDate ? new Date(new Date(values.completedDate).toDateString()) : undefined,
      isMine: values.isMine,
      v: values.v,
    };
    
    try {
      const updatedResearch = await updateResearchMutation({researchId, researchDto});
      // Call parent's onSuccess with the created id
      onSuccess(updatedResearch);
    } catch (error: any) {
      // Set a generic error message
      actions.setStatus({ error: error.message || "Failed to update research." });
    } finally {
      actions.setSubmitting(false);
    }
    
  }

  return (
    <>
      {isError && (
        <Row>
          <Col>{ error.message }</Col>
        </Row>
      )}
      {isPending || isFetching && (
        <LoadingContainer />
      )}
      {isSuccess && research && (
      <Row>
        <Col>
          <Formik
            initialValues={initialValues}
            validationSchema={getNewResearchSchema(t)}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, status, setFieldValue }) => (
              <Form>
                <fieldset disabled={isSubmitting}>
                  <BootstrapForm.Group className="mb-4" controlId="formType">
                    <RequiredFormLabel>{t('typeLabel')}</RequiredFormLabel>
                    <Field as="select" name="type" className="form-select">
                      {Object.values(DegreeType).map((type) => (
                        <option key={type} value={type}>
                          {t(`degreeType.${type}`)}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="type" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formDegree">
                    <RequiredFormLabel>{t('degreeLabel')}</RequiredFormLabel>
                    <Field name="degree" type="text" placeholder={t('degreePlaceholder')} className="form-control" />
                    <ErrorMessage name="degree" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formYear">
                    <BootstrapForm.Label>{t('yearLabel')}</BootstrapForm.Label>
                    <Field name="completedYear" type="text" placeholder={t('yearPlaceholder')} className="form-control" />
                    <ErrorMessage name="completedYear" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formTitle">
                    <RequiredFormLabel>{t('titleLabel')}</RequiredFormLabel>
                    <Field name="title" type="text" placeholder={t('titlePlaceholder')} className="form-control" />
                    <ErrorMessage name="title" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formLocation">
                    <BootstrapForm.Label>{t('locationLabel')}</BootstrapForm.Label>
                    <Field name="location" type="text" placeholder={t('locationPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('locationHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="location" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formAbstract">
                    <BootstrapForm.Label>{t('abstractLabel')}</BootstrapForm.Label>
                    <RichTextEditor
                      value={values.abstract}
                      onChange={(content) => setFieldValue('abstract', content)}
                    />
                    <ErrorMessage name="abstract" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formIsMine">
                    <Field name="isMine">
                      {({ field }: FieldProps) => (
                        <BootstrapForm.Check
                          type="checkbox"
                          label={t('isMineLabel')}
                          {...field}
                          checked={field.value}
                        />
                      )}
                    </Field>
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formSupervisors">
                    <RequiredFormLabel>{t('supervisorsLabel')}</RequiredFormLabel>
                    <FieldArray name="supervisors">
                      {({ push, remove, form }) => (
                        <div>
                          {values.supervisors && values.supervisors.length > 0 &&
                            values.supervisors.map((_, index) => (
                              <div key={index} className="mb-4 border rounded p-2">
                                <div className="d-flex align-items-start mb-2">
                                  {/* Supervisor Name */}
                                  <div className="flex-grow-1 me-2">
                                    <Field name={`supervisors.${index}.name`}>
                                      {({ field }: FieldProps) => (
                                        <BootstrapForm.Control
                                          {...field}
                                          type="text"
                                          placeholder={t('supervisorPlaceholder')}
                                        />
                                      )}
                                    </Field>
                                    <ErrorMessage name={`supervisors.${index}.name`} component="p" className="text-danger mt-1" />
                                  </div>

                                  {/* Remove Button */}
                                  <Button
                                    variant={values.supervisors.length === 1 ? 'outline-danger' : 'danger'}
                                    type="button"
                                    onClick={() => {
                                      if (values.supervisors.length > 1) {
                                        const isCurrentIsMe = values.supervisors[index]?.isMe;
                                        if (isCurrentIsMe) {
                                          // Clear isMe before removal to satisfy validation
                                          form.setFieldValue(`supervisors.${index}.isMe`, false);
                                        }
                                        remove(index);
                                      }
                                    }}
                                    disabled={values.supervisors.length === 1}
                                    title={values.supervisors.length === 1 ? t('supervisorCannotRemoveLast') : t('supervisorRemove')}
                                  >
                                    <FontAwesomeIcon icon={faMinus} />
                                  </Button>
                                </div>

                                {/* Profile URL */}
                                <div className="my-2">
                                  <Field name={`supervisors.${index}.profileUrl`}>
                                    {({ field }: FieldProps) => (
                                      <BootstrapForm.Control
                                        {...field}
                                        type="url"
                                        placeholder={t('supervisorProfileUrlPlaceholder')}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage name={`supervisors.${index}.profileUrl`} component="p" className="text-danger mt-1" />
                                </div>

                                {/* Affiliation */}
                                <div className="my-2">
                                  <Field name={`supervisors.${index}.affiliation`}>
                                    {({ field }: FieldProps) => (
                                      <BootstrapForm.Control
                                        {...field}
                                        type="text"
                                        placeholder={t('supervisorAffiliationPlaceholder')}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage name={`supervisors.${index}.affiliation`} component="p" className="text-danger mt-1" />
                                </div>

                                <div className="d-flex gap-4 ps-1">
                                  {/* 'Me' Checkbox */}
                                  <div className="form-check mt-2">
                                    <Field name={`supervisors.${index}.isMe`}>
                                      {({ field, form }: FieldProps) => {
                                        const handleChange = () => {
                                          const alreadySelected = values.supervisors[index].isMe;
                                            const updated = values.supervisors.map((supervisor, i) => ({
                                              ...supervisor,
                                              isMe: alreadySelected ? false : i === index,
                                            }));
                                            form.setFieldValue("supervisors", updated);
                                        };
                                        return (
                                          <>
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id={`supervisor-${index}-isMe`}
                                              checked={field.value}
                                              onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor={`supervisor-${index}-isMe`}>
                                              {t('supervisorIsMeLabel')}
                                            </label>
                                          </>
                                        );
                                      }}
                                    </Field>
                                  </div>

                                  {/* Supervisor Role Dropdown */}
                                  <div className="flex-grow-1">
                                    <Field as="select" name={`supervisors.${index}.role`} className="form-select">
                                      {Object.values(SupervisorRole).map((role) => (
                                        <option key={role} value={role}>
                                          {t(`supervisorRole.${role}`)}
                                        </option>
                                      ))}
                                    </Field>
                                    <ErrorMessage name={`supervisors.${index}.role`} component="p" className="text-danger mt-1" />
                                  </div>
                                </div>
                              </div>
                            ))}

                          {/* Add Supervisor Button */}
                          <Button
                            variant="primary"
                            type="button"
                            onClick={() => push({ name: '', affiliation: '', profileUrl: '', isMe: false, role: SupervisorRole.MAIN_SUPERVISOR })}
                            title={t('supervisorAdd')}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>

                          {/* Validation Summary */}
                          <ErrorMessage
                            name="supervisors"
                            render={(msg: any) => {
                              if (typeof msg === 'string') {
                                return <p className="text-danger mt-1">{msg}</p>;
                              }
                              if (Array.isArray(msg)) {
                                const errorMessages = msg
                                  .map((error) => {
                                    if (!error) return '';
                                    if (typeof error === 'string') return error;
                                    if (typeof error === 'object') {
                                      return Object.values(error).find(v => typeof v === 'string') || '';
                                    }
                                    return JSON.stringify(error);
                                  })
                                  .filter((message) => message);
                                return <p className="text-danger mt-1">{errorMessages.join(', ')}</p>;
                              }
                              return <p className="text-danger mt-1">{JSON.stringify(msg)}</p>;
                            }}
                          />
                        </div>
                      )}
                    </FieldArray>
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formKeywords">
                    <BootstrapForm.Label>{t('keywordsLabel')}</BootstrapForm.Label>
                    <FieldArray name="keywords">
                      {({ push, remove }) => (
                        <div>
                          { values.keywords && values.keywords.length > 0 && 
                            values.keywords.map((_, index) => (
                              <div key={index} className="d-flex mb-2 align-items-center">
                                <Field name={`keywords.${index}`} className="form-control me-2" />
                                <Button variant="danger" type="button" onClick={() => remove(index)} title={t('keywordsRemove')}>
                                  <FontAwesomeIcon icon={faMinus} />
                                </Button>
                              </div>
                          ))}
                          <Button variant="primary" type="button" onClick={() => push('')} title={t('keywordsAdd')}>
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                    <BootstrapForm.Text className="text-muted">{t('keywordsHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="keywords" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formThesisUrl">
                    <BootstrapForm.Label>{t('thesisUrlLabel')}</BootstrapForm.Label>
                    <Field name="thesisUrl" type="url" placeholder={t('thesisUrlPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('thesisUrlHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="thesisUrl" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formGithubUrl">
                    <BootstrapForm.Label>{t('githubUrlLabel')}</BootstrapForm.Label>
                    <Field name="githubUrl" type="url" placeholder={t('githubUrlPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('githubUrlHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="githubUrl" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formSlidesUrl">
                    <BootstrapForm.Label>{t('slidesUrlLabel')}</BootstrapForm.Label>
                    <Field name="slidesUrl" type="url" placeholder={t('slidesUrlPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('slidesUrlHelp')}</BootstrapForm.Text>
                    <ErrorMessage name="slidesUrl" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formStudentName">
                    <BootstrapForm.Label>{t('studentNameLabel')}</BootstrapForm.Label>
                    <Field name="studentName" type="text" placeholder={t('studentNamePlaceholder')} className="form-control" />
                    <ErrorMessage name="studentName" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formSupervisionStatus">
                    <RequiredFormLabel>{t('supervisionStatusLabel')}</RequiredFormLabel>
                    <Field as="select" name="supervisionStatus" className="form-select">
                      {Object.values(SupervisionStatus).map((supervisionStatus) => (
                        <option key={supervisionStatus} value={supervisionStatus}>
                          {t(`supervisionStatus.${supervisionStatus}`)}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="supervisionStatus" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formRegistrationNumber">
                    <BootstrapForm.Label>{t('registrationNumberLabel')}</BootstrapForm.Label>
                    <Field name="registrationNumber" type="text" placeholder={t('registrationNumberPlaceholder')} className="form-control" />
                    <ErrorMessage name="registrationNumber" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formStartedDate">
                    <BootstrapForm.Label>{t('startedDateLabel')}</BootstrapForm.Label>
                    <Field name="startedDate" type="text" className="form-control">
                      {({ field, form }: FieldProps) => (
                        <DatePicker
                          wrapperClassName="w-100"
                          className="form-control"
                          closeOnScroll={true}
                          isClearable={true}
                          showIcon={true}
                          selected={field.value ? new Date(field.value) : null}
                          onChange={date => form.setFieldValue(field.name, date)}
                          dateFormat="dd-MM-yyyy"
                          placeholderText={t('startedDatePlaceholder')}
                          icon={<i className="bi bi-calendar2-check-fill"></i>}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="startedDate" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-4" controlId="formCompletedDate">
                    <BootstrapForm.Label>{t('completedDateLabel')}</BootstrapForm.Label>
                    <Field name="completedDate" type="text" className="form-control">
                      {({ field, form }: FieldProps) => (
                        <DatePicker
                          wrapperClassName="w-100"
                          className="form-control"
                          closeOnScroll={true}
                          isClearable={true}
                          showIcon={true}
                          selected={field.value ? new Date(field.value) : null}
                          onChange={date => form.setFieldValue(field.name, date)}
                          dateFormat="dd-MM-yyyy"
                          placeholderText={t('completedDatePlaceholder')}
                          icon={<i className="bi bi-calendar2-check-fill"></i>}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="completedDate" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                </fieldset>
                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => router.push(`/dashboard/research`)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="me-1" /> {t('cancel')}
                  </Button>
                  <Button variant="success" type="submit" disabled={isSubmitting || isPendingUpdateResearch}>
                    {isSubmitting || isPendingUpdateResearch ? (
                      <>
                        <FontAwesomeIcon icon={faCircleNotch} className="me-1" spin /> {t('submitting')}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} className="me-1" /> {t('submit')}
                      </>
                    )}
                  </Button>
                </div>
                {status && status.error && (
                  <div className="alert alert-danger mt-3">{status.error}</div>
                )}
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
      )}
    </>
  )
}

export default UpdateResearchForm;