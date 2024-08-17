import NavigationBar from "./components/NavigationBar";
import useLanguage from "./hooks/useLanguage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Footer } from "./components/Footer";
import { Teaching } from "./pages/Teaching";
import { Research } from "./pages/Research";
import "./App.scss";

function App() {
  const { language, changeLanguage } = useLanguage();

  return (
    <>
      <BrowserRouter>
        <div className='app' lang={language}>
          <NavigationBar changeLanguage={changeLanguage} currentLanguage={language} />
          <main>
            <Routes>
              <Route index element={ <Home /> }></Route>
              <Route path='home' element={ <Home /> }></Route>
              <Route path='teaching' element={ <Teaching /> }></Route>
              <Route path='research' element={ <Research /> }></Route>
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
