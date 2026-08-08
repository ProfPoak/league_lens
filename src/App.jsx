import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TeamPage from './pages/TeamPage'
import PlayerPage from './pages/PlayerPage'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/team/:id" element={<TeamPage />} />
      <Route path="/player/:id" element={<PlayerPage />} />
    </Routes>
  )
}

export default App
