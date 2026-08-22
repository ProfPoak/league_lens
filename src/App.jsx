import { Routes, Route } from 'react-router-dom'
import EmptyState from './components/common/EmptyState'
import HomePage from './pages/HomePage'
import TeamPage from './pages/TeamPage'
import PlayerPage from './pages/PlayerPage'
import './styles/App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/team/:id" element={<TeamPage />} />
      <Route path="/player/:id" element={<PlayerPage />} />
      <Route path="*" element={<EmptyState message="404 Page not found." />} />
    </Routes>
  )
}

export default App
