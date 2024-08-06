import { Container, Nav, Navbar } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const NavigationBar = () => {
  const { t } = useTranslation('', { keyPrefix: 'components.NavigationBar' });

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#">{t('title')}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="me-auto">
              <Nav.Link href="#">{t('teaching')}</Nav.Link>
              <Nav.Link href="#link">{t('research')}</Nav.Link>
              <Nav.Link href="#link">{t('publications')}</Nav.Link>
              <Nav.Link href="#link">{t('awards')}</Nav.Link>
              <Nav.Link href="#link">{t('experience')}</Nav.Link>
              <Nav.Link href="#link">{t('contact')}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default NavigationBar;
