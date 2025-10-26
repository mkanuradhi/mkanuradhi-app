"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, Col, Row } from "react-bootstrap";
import GlowButton from "./GlowButton";
import "./blog-post-card.scss";

const baseTPath = 'components.BlogPostCard';

interface BlogPostCardProps {
  title: string;
  summary: string;
  img?: string;
  path: string;
  fDate: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({title, summary, img, path, fDate}) => {
  const t = useTranslations(baseTPath);

  return (
    <>
      <motion.div
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
        <Card className="my-3 shadow blog-post-card">
          <Row className="g-0 flex-column flex-md-row">
          {img && (
            <Col md={4}>
              <Card.Img
                src={img}
                alt={`Image for ${title}`}
                style={{ objectFit: 'cover', height: '100%', maxHeight: '32rem' }}
              />
            </Col>
            )}
            {/* Right Column for the Content */}
            <Col md={img ? 8 : 12}>
              <Card.Body>
                <Card.Title>{ title }</Card.Title>
                <Card.Text className="text-muted fs-7">
                  { fDate }
                </Card.Text>
                <hr className="divider" />
                <Card.Text>
                  { summary }
                </Card.Text>
                <Link href={`blog/${path}`}>
                  <motion.div
                    whileHover="hover"
                    className="d-inline-block"
                  >
                    <GlowButton>
                      {t('readMore')}
                      <motion.i
                        className="bi bi-arrow-right ms-2"
                        variants={{
                          hover: { x: 5 },
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </GlowButton>
                  </motion.div>
                </Link>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </motion.div>
    </>
  )
}

export default BlogPostCard;