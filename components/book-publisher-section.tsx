import { LocalizedBookPublisher } from "@/interfaces/i-book";
import Image from 'next/image';

interface BookPublisherProps {
  lPublisher: LocalizedBookPublisher;
}

const BookPublisherSection: React.FC<BookPublisherProps> = ({ lPublisher }) => {
  return (
    <div className="d-flex align-items-center gap-3 mt-4">
      {lPublisher.imageUrl && (
        <div>
          <div
            style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '100%', overflow: 'hidden', flexShrink: 0 }}
          >
            <Image
              src={lPublisher?.imageUrl}
              alt={lPublisher?.name ?? 'Publisher logo'}
              fill
              style={{ objectFit: 'contain' }}
              sizes="32px"
            />
          </div>
        </div>
      )}
      <div>
        <h3 className="h6 mb-0">
          <a href={lPublisher?.webUrl} target="_blank" rel="noopener noreferrer" 
            className='text-decoration-none' 
            style={{ color: 'inherit' }}
          >
            {lPublisher?.name}
          </a>
        </h3>
        <div className="text-muted small">
          {lPublisher?.address}
        </div>
      </div>
    </div>
  );
}

export default BookPublisherSection;