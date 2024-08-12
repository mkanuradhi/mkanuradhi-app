import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import "./ExternalLinkBar.scss";

interface LinkProps {
  tooltipText: string;
  url: string;
  faIcon: IconProp;
}

interface ExternalLinkBarProps {
  links: LinkProps[];
}

const ExternalLinkBar: React.FC<ExternalLinkBarProps> = ({ links }) => (
  <Container className="external-link-bar">
    <Row className="margin-row">
      {links.map((link, index) => (
        <Col key={index} className="d-flex justify-content-center align-items-center">
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id={`tooltip-${index}`}>
                {link.tooltipText}
              </Tooltip>
            }
            >
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={link.faIcon} size="2x" />
            </a>
          </OverlayTrigger>
        </Col>
      ))}
    </Row>
  </Container>
);

export default ExternalLinkBar;