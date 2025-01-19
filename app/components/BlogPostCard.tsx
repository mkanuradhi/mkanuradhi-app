"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button, Card, Col, Row } from "react-bootstrap";

const baseTPath = 'components.BlogPostCard';

interface BlogPostCardProps {
  title: string;
  summary: string;
  img: string;
  path: string;
  fDate: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({title, summary, img, path, fDate}) => {
  const t = useTranslations(baseTPath);

  return (
    <>
      <Card className="my-3 shadow">
        <Row className="g-0 flex-column flex-md-row">
          {/* Left Column for the Image */}
          <Col md={4}>
            <Card.Img
              src={img}
              alt={`Image for ${title}`}
              style={{ objectFit: 'cover', height: '100%', maxHeight: '32rem' }}
            />
          </Col>
          {/* Right Column for the Content */}
          <Col md={8}>
            <Card.Body>
              <Card.Title>{ title }</Card.Title>
              <Card.Text className="text-muted fs-7">
                { fDate }
              </Card.Text>
              <Card.Text>
                { summary }
              </Card.Text>
              <Link href={`blog/${path}`}>
                <Button variant="primary">{ t('readMore') }</Button>
              </Link>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default BlogPostCard