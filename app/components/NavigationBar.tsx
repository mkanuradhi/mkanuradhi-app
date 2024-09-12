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

  const navLinks = [
    { title: t('teaching'), path: '/teaching'},
    { title: t('research'), path: '/research'},
    { title: t('publications'), path: '/publications'},
    { title: t('awards'), path: '/awards'},
    { title: t('experience'), path: '/experience'},
    { title: t('contact'), path: '/contact'},
  ];

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
                {navLinks.map((navLink) => (
                  <Nav.Link key={navLink.title} as={Link} href={navLink.path} active={pathname.startsWith(navLink.path)}>
                    {navLink.title}
                  </Nav.Link>
                ))}
              </Nav>
              <Nav>
                <Nav.Link onClick={toggleTheme} className={theme === 'light' ? styles.navbarLightThemeIcon : styles.navbarDarkThemeIcon}>
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
