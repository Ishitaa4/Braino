import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Practice from './pages/Practice'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice/:deckId" element={<Practice />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App