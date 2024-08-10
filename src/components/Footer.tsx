import { Col, Container, Row } from "react-bootstrap";
import "./Footer.scss"

export const Footer = () => {
  return (
    <>
      <footer className="footer-bar">
        <Container>
          <Row>
            <Col sm={12}>
              <div className="footer-content">
                <p className="text-center">Copyright 2024 Anuradha Ariyaratne.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}
