import { Accordion, Badge } from "react-bootstrap";
import SanitizedHtml from "./sanitized-html";
import { useTranslations } from "next-intl";
import "./en-reference-accordion.scss";

const baseTPath = 'components.EnReferenceAccordion';

interface EnglishReferenceAccordionProps {
  content: string;
  isHtml?: boolean;
}

const EnReferenceAccordion: React.FC<EnglishReferenceAccordionProps> = ({ content, isHtml }) => {
  const t = useTranslations(baseTPath);

  return (
    <Accordion className="mb-2 en-reference-accordion">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <Badge bg="secondary" className='me-2'>{t('badgeLabel')}</Badge>
          <span className='small text-muted fw-semibold'>{t('title')}</span>
        </Accordion.Header>
        <Accordion.Body>
          {isHtml ? (
            <SanitizedHtml html={content} />
          ) : (
            content
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default EnReferenceAccordion;