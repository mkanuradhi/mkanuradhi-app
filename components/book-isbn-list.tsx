import { BookIsbnFormat } from "@/enums/book-enums";
import { BookIsbn } from "@/interfaces/i-book";
import { useTranslations } from "next-intl";
import "./book-isbn-list.scss";

const baseTPath = 'components.BookViewer';

const ISBN_FORMAT_COLORS: Record<BookIsbnFormat, string> = {
  [BookIsbnFormat.PAPERBACK]: 'var(--isbn-color-paperback)',
  [BookIsbnFormat.HARDCOVER]: 'var(--isbn-color-hardcover)',
  [BookIsbnFormat.EBOOK]:     'var(--isbn-color-ebook)',
};

interface BookIsbnListProps {
  isbns: BookIsbn[];
}

const BookIsbnList: React.FC<BookIsbnListProps> = ({ isbns }) => {
  const t = useTranslations(baseTPath);

  if (!isbns || isbns.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="h6 mb-3" style={{ color: 'var(--bs-secondary-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {t('isbnSectionLabel')}
      </h3>
      
      <div className="d-flex flex-wrap gap-3">
        {isbns.map((isbn, index) => (
          <div
            key={index}
            className="d-flex align-items-center gap-2"
            style={{
              background: 'var(--bs-secondary-bg)',
              borderRadius: 8,
              borderLeft: `3px solid ${ISBN_FORMAT_COLORS[isbn.format]}`,
              padding: '6px 12px',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: 'var(--bs-secondary-color)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              {t(`isbnFormat.${isbn.format}`)}
            </span>
            <span style={{ fontFamily: 'var(--bs-font-monospace)', fontSize: 13, fontWeight: 500 }}>
              {isbn.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookIsbnList;