import { Link } from "@/i18n/routing";
import { LocalizedSummaryBook } from "@/interfaces/i-book";
import { useTranslations } from "next-intl";
import { Badge, Card, Col, Row } from "react-bootstrap";
import SanitizedHtml from "./sanitized-html";
import GlowButton from "./GlowButton";
import { motion } from "framer-motion";
import "./book-card.scss";

const baseTPath = 'components.BookCard';

interface BookCardProps {
  lsBook: LocalizedSummaryBook;
  reversed: boolean;
}

const BookCard: React.FC<BookCardProps> = ({lsBook, reversed}) => {
  const t = useTranslations(baseTPath);

  return (
    <>
      <motion.div className="book-card"
        whileHover={{
          scale: 1.01,
          boxShadow: '0px 12px 30px rgba(var(--bs-body-color-rgb), 0.2)'
        }}
        transition={{
          type: 'spring',
          stiffness: 250,
          damping: 20
        }}
      >
        <Card className={`mb-4 shadow glass-card ${reversed ? 'glass-card-reversed' : ''}`}>
          <Card.Body className="p-4">
            <Row className={`${reversed ? 'flex-row-reverse' : ''}`}>
              <Col xs={12} sm={12} md={6} lg={4}>
                {lsBook.coverImage && (
                  <div className="book-cover-wrapper rounded">
                    <Card.Img 
                      src={lsBook.coverImage} 
                      className="position-absolute rounded object-fit-cover w-100 h-100"
                      style={{ inset: 0 }}
                    />
                  </div>
                )}
              </Col>

              <Col xs={12} sm={12} md={lsBook.coverImage ? 6 : 12} lg={lsBook.coverImage ? 8 : 12} className={reversed ? 'text-md-end' : ''}>
                <Badge className="my-3 mt-md-0 lang-badge" pill data-lang={lsBook.writtenLang}>
                  {t(`language.${lsBook.writtenLang}`)}
                </Badge>

                <h2 className="h1 mb-2">{lsBook.titleOriginal}</h2>

                {lsBook.subtitleOriginal && (
                  <h3 className="h6 fst-italic text-muted mb-3">{lsBook.subtitleOriginal}</h3>
                )}

                <div className={`d-flex gap-4 mb-3 ${reversed ? 'justify-content-md-end' : ''}`}>
                  {lsBook.publisher?.name && (
                    <span>
                      <i className="bi bi-shop me-2" />
                      {lsBook.publisher.name}
                    </span>
                  )}
                  <span>
                    <i className="bi bi-calendar me-2" />
                    {lsBook.publishedYear}
                  </span>
                </div>

                <div className="mb-3">
                  <SanitizedHtml html={lsBook.description} />
                </div>

                <Link href={`/books/${lsBook.path}`}>
                  <motion.div
                    whileHover="hover"
                    className="d-inline-block"
                  >
                    <GlowButton>
                      {t('viewDetails')}
                      <motion.i
                        className="bi bi-arrow-right ms-2"
                        variants={{
                          hover: { x: 2 },
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </GlowButton>
                  </motion.div>
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </motion.div>
    </>
  );

}

export default BookCard;
