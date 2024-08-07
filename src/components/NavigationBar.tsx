import { faLanguage, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";

interface NavigationBarProps {
  changeLanguage: (lng: string) => void;
  currentLanguage: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ changeLanguage, currentLanguage }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation('', { keyPrefix: 'components.NavigationBar' });

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#">{t('title')}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#">{t('teaching')}</Nav.Link>
              <Nav.Link href="#">{t('research')}</Nav.Link>
              <Nav.Link href="#">{t('publications')}</Nav.Link>
              <Nav.Link href="#">{t('awards')}</Nav.Link>
              <Nav.Link href="#">{t('experience')}</Nav.Link>
              <Nav.Link href="#">{t('contact')}</Nav.Link>
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
