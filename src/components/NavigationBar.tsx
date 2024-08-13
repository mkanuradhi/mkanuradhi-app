import { faLanguage, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.scss";

interface NavigationBarProps {
  changeLanguage: (lng: string) => void;
  currentLanguage: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ changeLanguage, currentLanguage }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation('', { keyPrefix: 'components.NavigationBar' });
  const navigate = useNavigate();

  return (
    <>
      <Navbar collapseOnSelect fixed="top" expand="lg" className="bg-body-tertiary bg-opacity-75 navbar-top">
        <Container>
          <Navbar.Brand onClick={() => navigate("/")} href="#">{t('title')}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Offcanvas
              id="basic-navbar-nav"
              aria-labelledby="basic-navbar-label"
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="basic-navbar-label">
                {t('title')}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="me-auto">
                  <Nav.Link onClick={() => navigate("/teaching")} href="#">{t('teaching')}</Nav.Link>
                  <Nav.Link onClick={() => navigate("/research")} href="#">{t('research')}</Nav.Link>
                  <Nav.Link onClick={() => navigate("/publications")} href="#">{t('publications')}</Nav.Link>
                  <Nav.Link onClick={() => navigate("/awards")} href="#">{t('awards')}</Nav.Link>
                  <Nav.Link onClick={() => navigate("/experience")} href="#">{t('experience')}</Nav.Link>
                  <Nav.Link onClick={() => navigate("/contact")} href="#">{t('contact')}</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link onClick={toggleTheme}>
                    <FontAwesomeIcon icon={theme === 'light' ? faSun : faMoon} />
                  </Nav.Link>
                  <NavDropdown title={<><FontAwesomeIcon icon={faLanguage} /></>} id="collapsible-nav-dropdown">
                    <NavDropdown.Item onClick={() => changeLanguage('en')} active={currentLanguage === 'en'}>
                      { t('en') }
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => changeLanguage('si')} active={currentLanguage === 'si'}>
                      { t('si') }
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Offcanvas.Body>
          </Navbar.Offcanvas>
          {/* <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/teaching")}>{t('teaching')}</Nav.Link>
              <Nav.Link onClick={() => navigate("/research")}>{t('research')}</Nav.Link>
              <Nav.Link onClick={() => navigate("/publications")}>{t('publications')}</Nav.Link>
              <Nav.Link onClick={() => navigate("/awards")}>{t('awards')}</Nav.Link>
              <Nav.Link onClick={() => navigate("/experience")}>{t('experience')}</Nav.Link>
              <Nav.Link onClick={() => navigate("/contact")}>{t('contact')}</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={toggleTheme}>
                <FontAwesomeIcon icon={theme === 'light' ? faSun : faMoon} />
              </Nav.Link>
              <NavDropdown title={<><FontAwesomeIcon icon={faLanguage} /></>} id="collapsible-nav-dropdown">
                <NavDropdown.Item onClick={() => changeLanguage('en')} active={currentLanguage === 'en'}>
                  { t('en') }
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage('si')} active={currentLanguage === 'si'}>
                  { t('si') }
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse> */}
        </Container>
      </Navbar>
    </>
  )
}

export default NavigationBar;
