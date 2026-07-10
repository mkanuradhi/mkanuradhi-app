"use client";
import { LocalizedBook } from "@/interfaces/i-book";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumb, Card, Col, Container, Row } from "react-bootstrap";
import SanitizedHtml from "./sanitized-html";
import BookAuthorsList from "./book-authors-list";
import BookIsbnList from "./book-isbn-list";
import BookSampleFileSection from "./book-sample-file-section";
import BookPublisherSection from "./book-publisher-section";
import BookSubjectsList from "./book-subjects-list";
import BookPreviewImagesGallery from "./book-preview-images-gallery";
import { Link } from '@/i18n/routing';
import "./book-viewer.scss";

const baseTPath = 'components.BookViewer';

interface MetaItem {
  label: string;
  value: string | number | undefined | null;
}

const MetaGrid: React.FC<{ items: MetaItem[] }> = ({ items }) => {
  const available = items.filter(item => item.value !== undefined && item.value !== null && item.value !== '');
  if (available.length === 0) return null;

  return (
    <div className="d-flex flex-wrap gap-2 my-3">
      {available.map((item, index) => (
        <div
          key={index}
          style={{ background: 'var(--bs-secondary-bg)', borderRadius: 6, padding: '8px 12px', minWidth: 100 }}
        >
          <div style={{ fontSize: 11, color: 'var(--bs-secondary-color)', marginBottom: 2 }}>{item.label}</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};

interface BookViewerProps {
  localizedBook: LocalizedBook;
}

const BookViewer: React.FC<BookViewerProps> = ({ localizedBook }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();

  const metaItems: MetaItem[] = [
    { label: t('writtenLang'),   value: t(`writtenLang${localizedBook.writtenLang}`) },
    { label: t('publishedYear'), value: localizedBook.publishedYear },
    { label: t('edition'),       value: localizedBook.edition       },
    { label: t('pages'),         value: localizedBook.pages         },
  ];

  return (
    <>
      <Container fluid="md" className="book-viewer">
        <Row className="my-4">
          <Col>
            <Row>
              <Col>
                <Breadcrumb>
                  <Breadcrumb.Item linkAs="span">
                    <Link href="/">{t('home')}</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item linkAs="span">
                    <Link href="/books">{t('books')}</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            <Card className='shadow glass-card'>
              <Card.Body className="p-4">
                <Row>
                  <Col xs={12} sm={12} md={6} lg={4}>
                    {localizedBook.coverImage && (
                      <div className="book-cover-wrapper rounded">
                        <Card.Img 
                          src={localizedBook.coverImage} 
                          className="position-absolute rounded object-fit-cover w-100 h-100"
                          style={{ inset: 0 }}
                        />
                      </div>
                    )}
                  </Col>
                  <Col xs={12} sm={12} md={localizedBook.coverImage ? 6 : 12} lg={localizedBook.coverImage ? 8 : 12}>
                    <h1 className="mt-4 mb-3 mt-md-0 display-4">
                      {localizedBook.titleOriginal}
                    </h1>

                    {localizedBook.subtitleOriginal && (
                      <h2 className="h4 fst-italic text-muted mb-3">{localizedBook.subtitleOriginal}</h2>
                    )}

                    {localizedBook.subject && localizedBook.subject.length > 0 && (
                      <BookSubjectsList subjects={localizedBook.subject} />
                    )}

                    {/* Metadata grid — only shows available fields */}
                    <MetaGrid items={metaItems} />

                    {/* publisher */}
                    {localizedBook.publisher && (
                      <BookPublisherSection lPublisher={localizedBook.publisher} />
                    )}

                    {/* ISBNs */}
                    {localizedBook.isbns && localizedBook.isbns.length > 0 && (
                      <BookIsbnList isbns={localizedBook.isbns} />
                    )}

                  </Col>
                  <Col className='mt-4'>
                    {/* Authors list */}
                    {localizedBook.authors && localizedBook.authors.length > 0 && (
                      <BookAuthorsList authors={localizedBook.authors} />
                    )}

                    {/* long description */}
                    <SanitizedHtml html={localizedBook.content} />

                    {/* sample file and buy link */}
                    {localizedBook.pdfTeaser && (
                      <BookSampleFileSection sampleFileUrl={localizedBook.pdfTeaser} buyLink={localizedBook.buyLink} />
                    )}

                    {localizedBook.previewImages && (
                      <BookPreviewImagesGallery previewImages={localizedBook.previewImages} />
                    )}

                  </Col>

                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BookViewer;
