import NavigationBar from "./components/NavigationBar";
import useTitleUpdater from "./hooks/useTitleUpdater";
import useLanguage from "./hooks/useLanguage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Footer } from "./components/Footer";
import { Teaching } from "./pages/Teaching";
import "./App.scss";

function App() {
  useTitleUpdater();
  const { language, changeLanguage } = useLanguage();

  return (
    <>
      <BrowserRouter>
        <div className='app' lang={language}>
          <nav>
            <NavigationBar changeLanguage={changeLanguage} currentLanguage={language} />
          </nav>
          <main>
            <Routes>
              <Route index element={ <Home /> }></Route>
              <Route path='home' element={ <Home /> }></Route>
              <Route path='teaching' element={ <Teaching /> }></Route>
              <Route path='*' element={ <NotFound /> }></Route>
            </Routes>
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
