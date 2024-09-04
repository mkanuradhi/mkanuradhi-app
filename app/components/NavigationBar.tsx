"use client";
import { useState } from "react";
import { faLanguage, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from "react-bootstrap";
import { useTranslations } from 'next-intl';
import { useTheme } from "../hooks/useTheme";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link, usePathname, useRouter } from '@/i18n/routing';
import styles from './NavigationBar.module.scss'

interface NavigationBarProps {
}

const NavigationBar: React.FC<NavigationBarProps> = ({  }) => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('components.NavigationBar');
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 40);
  });

  const changeLanguage = (lang: "en" | "si") => {
    router.replace(pathname, { locale: lang });
  }

  return (
    <>
      <Navbar 
        collapseOnSelect 
        fixed="top" 
        expand="lg" 
        className={`bg-body-tertiary bg-opacity-75 ${styles.navbarTop}`}
        as={motion.nav}
        initial={{ boxShadow: 'none' }}
        animate={{ boxShadow: isScrolled ? '0px 6px 20px rgba(var(--bs-body-color-rgb), 0.2)' : 'none' }}
        transition={{ duration: 0.3 }}
      >
        <Container fluid="md">
          <Navbar.Brand as={Link} href="/">
            {t('title')}
          </Navbar.Brand>
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
                <Nav.Link as={Link} href="/teaching">
                  {t('teaching')}
                </Nav.Link>
                <Nav.Link as={Link} href="/research">
                  {t('research')}
                </Nav.Link>
                <Nav.Link as={Link} href="/publications">
                  {t('publications')}
                </Nav.Link>
                <Nav.Link as={Link} href="/awards">
                  {t('awards')}
                </Nav.Link>
                <Nav.Link as={Link} href="/experience">
                  {t('experience')}
                </Nav.Link>
                <Nav.Link as={Link} href="/contact">
                  {t('contact')}
                </Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={toggleTheme}>
                  <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
                </Nav.Link>
                <NavDropdown title={<><FontAwesomeIcon icon={faLanguage} /></>} id="collapsible-nav-dropdown">
                  <NavDropdown.Item onClick={() => changeLanguage('en')}>
                    { t('en') }
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => changeLanguage('si')}>
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
