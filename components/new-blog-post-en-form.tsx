"use client";
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Col, Row, Form as BootstrapForm } from 'react-bootstrap';
import { getNewBlogPostEnSchema } from '@/schemas/new-blog-post-en-schema';
import { useTranslations } from 'next-intl';

const baseTPath = 'components.NewBlogPostEnForm';

const initialValues = {
  titleEn: '',
  summaryEn: '',
  contentEn: '',
  pageDescriptionEn: '',
  keywords: '',
  dateTime: '',
}

const NewBlogPostEnForm = () => {
  const t = useTranslations(baseTPath);

  const handleSubmit = async () => {
    console.log('submit');
  }

  return (
    <>
      <Row>
        <Col>
          <Formik
            initialValues={initialValues}
            validationSchema={getNewBlogPostEnSchema(t)}
            onSubmit={handleSubmit}
          >
            <Form>
              <fieldset>
                <BootstrapForm.Group className="mb-4" controlId="formTitleEn">
                  <BootstrapForm.Label>{t('titleEnLabel')}</BootstrapForm.Label>
                  <Field name="titleEn" type="text" placeholder={t('titleEnPlaceholder')} className="form-control" />
                  <ErrorMessage name="titleEn" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>
                <BootstrapForm.Group className="mb-4" controlId="formSummaryEn">
                  <BootstrapForm.Label>{t('summaryEnLabel')}</BootstrapForm.Label>
                  <Field as="textarea" name="summaryEn" placeholder={t('summaryEnPlaceholder')} className="form-control" rows={3} />
                  <BootstrapForm.Text className="text-muted">{t('summaryEnHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="summaryEn" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>
                <BootstrapForm.Group className="mb-4" controlId="formContentEn">
                  <BootstrapForm.Label>{t('contentEnLabel')}</BootstrapForm.Label>
                  <Field as="textarea" name="contentEn" placeholder={t('contentEnPlaceholder')} className="form-control" rows={8} />
                  <BootstrapForm.Text className="text-muted">{t('contentEnHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="contentEn" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>
                <BootstrapForm.Group className="mb-4" controlId="formPageDescriptionEn">
                  <BootstrapForm.Label>{t('pageDescriptionEnLabel')}</BootstrapForm.Label>
                  <Field as="textarea" name="pageDescriptionEn" placeholder={t('pageDescriptionEnPlaceholder')} className="form-control" rows={3} />
                  <BootstrapForm.Text className="text-muted">{t('pageDescriptionEnHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="pageDescriptionEn" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>
                
              </fieldset>
            </Form>
          </Formik>
        </Col>
      </Row>
    </>
  )
}

export default NewBlogPostEnForm;