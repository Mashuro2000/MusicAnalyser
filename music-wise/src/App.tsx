
import './App.css'
import { Search } from './pages/Search'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Search />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
