import { useState } from "react";
import { faLanguage, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import "./NavigationBar.scss";

interface NavigationBarProps {
  changeLanguage: (lng: string) => void;
  currentLanguage: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ changeLanguage, currentLanguage }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation('', { keyPrefix: 'components.NavigationBar' });
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 40);
  });

  const teachingPath = "/teaching";
  const researchPath = "/research";
  const publicationsPath = "/publications";
  const awardsPath = "/awards";
  const experiencePath = "/experience";
  const contactPath = "/contact";

  return (
    <>
      <Navbar 
        collapseOnSelect 
        fixed="top" 
        expand="lg" 
        className="bg-body-tertiary bg-opacity-75 navbar-top"
        as={motion.nav}
        initial={{ boxShadow: 'none' }}
        animate={{ boxShadow: isScrolled ? '0px 6px 20px rgba(var(--bs-body-color-rgb), 0.2)' : 'none' }}
        transition={{ duration: 0.3 }}
      >
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
                  <Nav.Link
                    onClick={() => navigate(teachingPath)} 
                    href="#"
                    active={location.pathname === teachingPath}
                    >
                      {t('teaching')}
                    </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate(researchPath)}
                    href="#"
                    active={location.pathname === researchPath}
                  >
                    {t('research')}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate(publicationsPath)}
                    href="#"
                    active={location.pathname === publicationsPath}
                  >
                    {t('publications')}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate(awardsPath)}
                    href="#"
                    active={location.pathname === awardsPath}
                  >
                    {t('awards')}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate(experiencePath)}
                    href="#"
                    active={location.pathname === experiencePath}
                  >
                    {t('experience')}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate(contactPath)}
                    href="#"
                    active={location.pathname === contactPath}
                  >
                    {t('contact')}
                  </Nav.Link>
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
        </Container>
      </Navbar>
    </>
  )
}

export default NavigationBar;
