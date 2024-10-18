import React from 'react'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom'
import Day1Editor from './apps/AppDay1'
import Display from './Display'
import Master from './MasterEditor'
import Day0Viewer from './viewers/Day0Viewer'
import Day0Master from './masters/Day0Master'
import Day1Viewer from './viewers/Day1Viewer'
// import Home from './Home'

const AppRouter: React.FC = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/Day1" element={<Day1Editor />} />
          <Route path="/Display" element={<Display />} />
          <Route path="/Master" element={<Master />} />
          <Route path="/Day0Viewer" element={<Day0Viewer />} />
          <Route path="/Day0Master" element={<Day0Master />} />
          <Route path="/Day1Viewer" element={<Day1Viewer />} />
        </Routes>
    </Router>
  )
}

export default AppRouter
