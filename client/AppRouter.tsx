import React from 'react'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom'
import Day1Editor from './AppDay1'
import Display from './Display'
import Master from './MasterEditor'
// import Home from './Home'

const AppRouter: React.FC = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/Day1" element={<Day1Editor />} />
          <Route path="/Display" element={<Display />} />
          <Route path="/Master" element={<Master />} />
        </Routes>
    </Router>
  )
}

export default AppRouter
