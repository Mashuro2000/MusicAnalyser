import './App.css'
import { Search } from './pages/Search'
import { SongPage } from './pages/SongPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/:songId" element={<SongPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
