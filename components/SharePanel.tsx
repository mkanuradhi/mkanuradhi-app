import React from 'react';
import { Col, Row } from 'react-bootstrap';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
}  from 'react-share';

interface SharePanelProps {
  title: string
  url: string;
  description?: string;
}

const SharePanel: React.FC<SharePanelProps> = ({ title, url, description }) => {

  return (
    <>
      <div className="share-panel">
        <Row className="g-2">
          <Col xs="auto">
            <FacebookShareButton url={url} title={title}>
              <FacebookIcon size={28} round />
            </FacebookShareButton>
          </Col>
          <Col xs="auto">
            <LinkedinShareButton url={url} title={title} summary={description}>
            <LinkedinIcon size={28} round />
          </LinkedinShareButton>
          </Col>
          <Col xs="auto">
            <WhatsappShareButton url={url} title={title}>
              <WhatsappIcon size={28} round />
            </WhatsappShareButton>
          </Col>
          <Col xs="auto">
            <TwitterShareButton url={url} title={title}>
              <TwitterIcon size={28} round />
            </TwitterShareButton>
          </Col>
          <Col xs="auto">
            <EmailShareButton url={url} subject={title} body={description}>
              <EmailIcon size={28} round />
            </EmailShareButton>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default SharePanel;