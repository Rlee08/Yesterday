import React from 'react'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom'
import CurrentEditor from './App'
import Display from './display'
// import Home from './Home'

const AppRouter: React.FC = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/App" element={<CurrentEditor />} />
          <Route path="/Display" element={<Display />} />
        </Routes>
    </Router>
  )
}

export default AppRouter
