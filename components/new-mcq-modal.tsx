import { useTranslations } from 'next-intl';
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps, FieldArray } from 'formik';
import { Form as BootstrapForm, Button, Modal } from 'react-bootstrap';
import { getNewMcqSchema } from '@/schemas/new-mcq-schema';
import RequiredFormLabel from './required-form-label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faMinus, faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CreateMcqDto } from '@/dtos/mcq-dto';
import { useCreateMcqMutation } from '@/hooks/use-mcqs';


const baseTPath = 'components.NewMcqModal';

const initialValues = {
  question: '',
  choices: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ],
  isMultiSelect: false,
  solutionExplanation: '',
}

interface NewMcqModalProps {
  quizId: string;
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const NewMcqModal: React.FC<NewMcqModalProps> = ({ quizId, show, onHide, onConfirm }) => {
  const t = useTranslations(baseTPath);

  const { mutateAsync: createMcqMutation, isPending: isPendingCreateMcq } = useCreateMcqMutation();

  const handleSubmit = async (
      values: typeof initialValues,
      actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }  
    ) => {
      actions.setStatus(undefined);
      const mcqDto: CreateMcqDto = {
        question: values.question,
        choices: values.choices,
        isMultiSelect: values.isMultiSelect,
        solutionExplanation: values.solutionExplanation,
      };
      
      try {
        const createdMcq = await createMcqMutation({quizId, mcqDto});
        onConfirm();
      } catch (error: any) {
        // Set a generic error message
        actions.setStatus({ error: error.message || "Failed to create mcq." });
      } finally {
        actions.setSubmitting(false);
      }
      
    }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        role="dialog"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        backdrop="static"
        size="lg"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={getNewMcqSchema(t)}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, status }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title id="delete-modal-title">{t('title')}</Modal.Title>
              </Modal.Header>
              <Modal.Body id="delete-modal-description">
                <fieldset disabled={isSubmitting}>
                  <BootstrapForm.Group className="mb-4" controlId="formQuestion">
                    <RequiredFormLabel>{t('questionLabel')}</RequiredFormLabel>
                    <Field as="textarea" name="question" placeholder={t('questionPlaceholder')} className="form-control" rows={3} />
                    <ErrorMessage name="question" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formChoices">
                    <RequiredFormLabel>{t('choicesLabel')}</RequiredFormLabel>
                    <FieldArray name="choices">
                      {({ push, remove }) => (
                        <div>
                          {values.choices && values.choices.length > 0 && 
                            values.choices.map((choice, index) => (
                              <div key={index} className="d-flex mb-4 align-items-center">
                                <div className="flex-grow-1 me-2">
                                  <Field name={`choices.${index}.text`}>
                                    {({ field }: FieldProps) => (
                                      <BootstrapForm.Control
                                        {...field}
                                        as="textarea"
                                        rows={2}
                                        placeholder={t('choicePlaceholder')}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage name={`choices.${index}.text`} component="p" className="text-danger mt-1" />
                                </div>
                                <div className="me-2">
                                  <Field name={`choices.${index}.isCorrect`}>
                                    {({ field }: FieldProps) => (
                                      <div className="form-check">
                                        <input
                                          type="checkbox"
                                          {...field}
                                          checked={field.value}
                                          className="form-check-input"
                                          id={`choice-${index}`}
                                        />
                                        <label className="form-check-label" htmlFor={`choice-${index}`}>
                                          {t('choiceCorrectLabel')}
                                        </label>
                                      </div>
                                    )}
                                  </Field>
                                </div>
                                <Button variant="outline-danger" type="button" onClick={() => remove(index)} size="sm">
                                  <FontAwesomeIcon icon={faMinus} />
                                </Button>
                              </div>
                            ))
                          }
                          <Button variant="primary" type="button" onClick={() => push({ text: '', isCorrect: false })}>
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          <ErrorMessage
                            name="choices"
                            render={(msg: any) => {
                              if (typeof msg === 'string') {
                                return <p className="text-danger mt-1">{msg}</p>;
                              }
                              if (Array.isArray(msg)) {
                                const errorMessages = msg
                                  .map((error) => {
                                    if (!error) return '';
                                    if (typeof error === 'string') return error;
                                    if (typeof error === 'object' && error.text) return error.text;
                                    return JSON.stringify(error);
                                  })
                                  .filter((message) => message); // remove empty strings
                                return <p className="text-danger mt-1">{errorMessages.join(', ')}</p>;
                              }
                              return <p className="text-danger mt-1">{JSON.stringify(msg)}</p>;
                            }}
                          />
                        </div>
                      )}
                    </FieldArray>
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formIsMultiSelect">
                    <BootstrapForm.Label>{t('isMultiSelectLabel')}</BootstrapForm.Label>
                    <Field name="isMultiSelect">
                      {({ field }: FieldProps) => (
                        <div className="form-check">
                          <input
                            type="checkbox"
                            {...field}
                            checked={field.value}
                            className="form-check-input"
                            id="isMultiSelect"
                          />
                          <label className="form-check-label" htmlFor="isMultiSelect">
                            {t('isMultiSelectPlaceholder')}
                          </label>
                        </div>
                      )}
                    </Field>
                    <ErrorMessage name="isMultiSelect" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group className="mb-4" controlId="formSolutionExplanation">
                    <BootstrapForm.Label>{t('solutionExplanationLabel')}</BootstrapForm.Label>
                    <Field as="textarea" name="solutionExplanation" placeholder={t('solutionExplanationPlaceholder')} className="form-control" rows={3} />
                    <ErrorMessage name="solutionExplanation" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                </fieldset>
                {status && status.error && (
                  <div className="alert alert-danger">{status.error}</div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={onHide} aria-label="Cancel adding new mcq">
                  {t('cancel')}
                </Button>
                <Button variant="success" type="submit" disabled={isSubmitting || isPendingCreateMcq} aria-label="Save new mcq">
                  {isSubmitting || isPendingCreateMcq ? (
                    <>
                      <FontAwesomeIcon icon={faCircleNotch} className="me-1" spin /> {t('submitting')}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} className="me-1" /> {t('submit')}
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default NewMcqModal;