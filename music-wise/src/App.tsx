import './App.css'
import { Search } from './pages/Search'
import { SongPage } from './pages/SongPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotFound } from './pages/NotFound';
import { NavBar } from './components/NavBar';
import { About } from './pages/About';

function App() {
  return (
    <Router>
      <div className='App'>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/songLyrics/:songId" element={<SongPage />} />
          <Route path="/About" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
