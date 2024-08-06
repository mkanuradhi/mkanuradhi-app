import { Container } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import useTheme from "./hooks/useTheme";
import NavigationBar from "./components/NavigationBar";
import { useTranslation } from "react-i18next";
import useTitleUpdater from "./hooks/useTitleUpdater";

function App() {
  const { toggleTheme } = useTheme();
  useTitleUpdater();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <Container>
        <div className='app'>
          <nav>
            <NavigationBar />
          </nav>
          <header>
            <h1>{t('title')}</h1>
          </header>
          <main>
            <Button onClick={toggleTheme}>Change theme</Button>
            <Button variant="danger">Danger Button</Button>
            <Button onClick={() => changeLanguage('en')}>{t('en')}</Button>
            <Button onClick={() => changeLanguage('si')}>{t('si')}</Button>
            <p>hello world</p>
          </main>
        </div>
      </Container>
    </>
  )
}

export default App
