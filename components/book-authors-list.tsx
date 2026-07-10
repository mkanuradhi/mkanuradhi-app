import { BookAuthorRole } from "@/enums/book-enums";
import { LocalizedBookAuthor } from "@/interfaces/i-book";
import { useTranslations } from "next-intl";
import Image from "next/image";
import "./book-authors-list.scss";

const baseTPath = 'components.BookViewer';

const AUTHOR_ROLE_COLORS: Record<BookAuthorRole, string> = {
  [BookAuthorRole.AUTHOR]:    '#2a9d8f', // teal — primary
  [BookAuthorRole.CO_AUTHOR]: '#457b9d', // blue
  [BookAuthorRole.EDITOR]:    '#d4a373', // warm tan
  [BookAuthorRole.REVIEWER]:  '#6c757d', // slate gray
};

interface AuthorAvatarProps {
  author: LocalizedBookAuthor;
}

const AuthorAvatar: React.FC<AuthorAvatarProps> = ({ author }) => {
  const t = useTranslations(baseTPath);
  const ringColor = AUTHOR_ROLE_COLORS[author.role];

  const initials = author.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const content = (
    <div className="author-avatar">
      <div
        style={{
          position: 'relative',
          width: 64,
          height: 64,
          borderRadius: '100%',
          padding: 2,
          background: ringColor,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '100%',
            overflow: 'hidden',
            background: 'var(--bs-secondary-bg)',
          }}
        >
          {author.imageUrl ? (
            <Image
              src={author.imageUrl}
              alt={author.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="64px"
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center h-100"
              style={{ fontSize: 14, fontWeight: 600, color: 'var(--bs-secondary-color)' }}
            >
              {initials}
            </div>
          )}
        </div>
      </div>

      <div className="author-name" title={author.name}>
        {author.name}
      </div>
      <div className="author-role" style={{ color: ringColor }}>
        {t(`authorRole.${author.role}`)}
      </div>
    </div>
  );

  return (
    <div className="author-avatar-wrapper">
      {author.profileUrl ? (
        <a
          href={author.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none"
          style={{ color: 'inherit' }}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

interface AuthorsListProps {
  authors: LocalizedBookAuthor[];
}

const BookAuthorsList: React.FC<AuthorsListProps> = ({ authors }) => {
  const t = useTranslations(baseTPath);

  if (!authors || authors.length === 0) return null;

  return (
    <div className="my-4">
      <h3
        className="h6 mb-3 text-center"
        style={{
          color: 'var(--bs-secondary-color)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {t('authorsSectionLabel')}
      </h3>

      <div className="authors-grid">
        {authors.map(author => (
          <AuthorAvatar key={author.id} author={author} />
        ))}
      </div>
    </div>
  );
};

export default BookAuthorsList;