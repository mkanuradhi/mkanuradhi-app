"use client";
import Link from "next/link";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import "./blog-post-options-card.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader, faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';

const baseTPath = 'components.BlogPostOptionsCard';

interface BlogPostCardOptionsProps {
  titleEn: string;
  summaryEn: string;
  titleSi: string;
  summarySi: string;
  img?: string;
  path: string;
  dateTime: Date;
  published: boolean;
}

const BlogPostOptionsCard: React.FC<BlogPostCardOptionsProps> = ({titleEn, summaryEn, titleSi, summarySi, img, path, dateTime, published}) => {
  const t = useTranslations(baseTPath);

  return (
    <>
      <Card className="my-3 shadow blog-post-options-card">
        <Row className="g-0 flex-column flex-md-row">
        {img && (
          <Col md={4}>
            <Card.Img
              src={img}
              alt={`Image for ${titleEn}`}
              style={{ objectFit: 'cover', height: '100%', maxHeight: '32rem' }}
            />
          </Col>
          )}
          {/* Right Column for the Content */}
          <Col md={img ? 8 : 12}>
            <Card.Body>
              <Card.Title>
                { titleEn }
              </Card.Title>
              <Card.Title>
                { titleSi }
              </Card.Title>
              <Card.Text className="text-muted fs-7">
                { new Date(dateTime).toLocaleDateString() }
              </Card.Text>
              <hr className="divider" />
              <Card.Text>
                { summaryEn }
              </Card.Text>
              <Card.Text>
                { summarySi }
              </Card.Text>
              <Link href={`blog/${path}`}>
                <Button>
                  <FontAwesomeIcon icon={faBookOpenReader} className="list-icon" /> { t('read') }
                </Button>
              </Link>
              <Button variant={published ? `warning` : `success`} className="ms-2">
                <FontAwesomeIcon
                  icon={published ? faEyeSlash : faEye}
                  className="list-icon"
                />{" "}
                {published ? t('unpublish') : t('publish')}
              </Button>
              <Button variant="danger" className="ms-2">
                <FontAwesomeIcon icon={faTrash} className="list-icon" /> { t('delete') }
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default BlogPostOptionsCard;