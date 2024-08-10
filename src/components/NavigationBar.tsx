import { faLanguage, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";

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
      <Navbar expand="lg" className="bg-body-tertiary bg-opacity-50">
        <Container>
          <Navbar.Brand onClick={() => navigate("/")}>{t('title')}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default NavigationBar;
