import React from 'react';
import { Montserrat } from "next/font/google";
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import "./not-found.scss";

const montserrat = Montserrat({ subsets: ["latin"] });

export async function generateMetadata () {

  return {
    title: `Not Found`,
    description: `The page cannot be found.`,
    keywords: 'not found',
  };
};

export default function NotFound() {

  return (
    <>
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <div className="notfound">
          <Container fluid="md">
            <Row className="my-4">
              <Col>
                <div className="notfound-content">
                  <h1>Not Found</h1>
                  <h2>404</h2>
                  <FontAwesomeIcon icon={faTriangleExclamation} style={{ height: '72px' }} />
                  <p><strong>Oops!</strong> The page you&apos;re looking for doesn&apos;t seem to exist. Try going back to <Link href="/">home page</Link> or checking the <em>URL</em>.</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </body>
    </html>
    </>
  );
}