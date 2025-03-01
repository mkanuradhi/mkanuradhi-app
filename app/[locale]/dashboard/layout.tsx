import SideBar from "@/components/side-bar";
import { Col, Container, Row } from "react-bootstrap";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="d-none d-md-block">
          <aside className="">
            <SideBar />
          </aside>
        </Col>
        <Col md={9} className="my-4">
          <section className="">
            {children}
          </section>
        </Col>
      </Row>
    </Container>
  );
}
