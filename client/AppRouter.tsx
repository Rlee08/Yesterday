import React from 'react'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom'
import Day1Editor from './apps/AppDay1'
import Display from './Display'
import DisplayDay3 from './DisplayDay3'
import Master from './MasterEditor'
import Day0Viewer from './viewers/Day0Viewer'
import Day0Master from './masters/Day0Master'
import Day1Viewer from './viewers/Day1Viewer'
import Day2Viewer from './viewers/Day2Viewer'
import Day3Viewer from './viewers/Day3Viewer'
import DisplayDay2 from './DisplayDay2'
import DisplayDay1 from './DisplayDay1'
// import Home from './Home'

const AppRouter: React.FC = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<DisplayDay3 />} />
          <Route path="/Day1Editor" element={<Day1Editor />} />
          <Route path="/Display1" element={<Display />} />
          <Route path="/DisplayDay3" element={<DisplayDay3 />} />
          <Route path="/DisplayDay2" element={<DisplayDay2 />} />
          <Route path="/DisplayDay1" element={<DisplayDay1 />} />
          <Route path="/Master" element={<Master />} />
          <Route path="/Day0Viewer" element={<Day0Viewer />} />
          <Route path="/Day0Master" element={<Day0Master />} />
          <Route path="/Day1Viewer" element={<Day1Viewer />} />
          <Route path="/Day2Viewer" element={<Day2Viewer />} />
          <Route path="/Day3Viewer" element={<Day3Viewer />} />
        </Routes>
    </Router>
  )
}

export default AppRouter
