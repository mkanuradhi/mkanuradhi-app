import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import GlowButton from "./GlowButton";
import Link from "next/link";
import { motion } from "framer-motion";

const baseTPath = 'components.BookViewer';

interface BookSampleFileProps {
  sampleFileUrl: string;
  buyLink?: string;
}

const BookSampleFileSection: React.FC<BookSampleFileProps> = ({ sampleFileUrl, buyLink }) => {
  const t = useTranslations(baseTPath);

  return (
    <div
      className="my-5 p-4 position-relative overflow-hidden"
      style={{
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(42,157,143,0.08), rgba(212,163,115,0.08))',
        border: '2px solid transparent',
        backgroundImage:
          'linear-gradient(var(--bs-body-bg), var(--bs-body-bg)), linear-gradient(135deg, #2a9d8f, #d4a373)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #2a9d8f, #21867a)',
              boxShadow: '0 4px 14px rgba(42,157,143,0.35)',
            }}
          >
            <FontAwesomeIcon icon={faFilePdf} size="lg" className="text-light" />
          </div>

          <div>
            <div className="display-6">
              {t('sampleTitle')}
            </div>
            <div className="lead text-muted">
              {t('sampleSubtitle')}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between gap-4">
          <Link href={sampleFileUrl} target="_blank" rel="noopener noreferrer">
            <motion.div
              whileHover="hover"
              className="d-inline-block"
            >
              <GlowButton clrOne="#2a9d8f" clrTwo="#238A7D">
                {t('viewSampleButtonLabel')}
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
          {buyLink && (
            <Link href={buyLink} target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover="hover"
                className="d-inline-block"
              >
                <GlowButton clrOne="#2a9d8f" clrTwo="#238A7D">
                  {t('buyLinkButtonLabel')}
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
          )}
        </div>

      </div>
    </div>
  );
};

export default BookSampleFileSection;