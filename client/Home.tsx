import React from 'react'
import { Link, } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div>
        <nav>
          <ul>
            <li>
              <Link to="/App">CurrentEditor</Link>
            </li>
            <li>
              <Link to="/Display">Display</Link>
            </li>
          </ul>
        </nav>
      <h1>CurrentEditor = "tomorrow" editor, Display = installation projection </h1>
      <p>this is in case you get lost.</p>
    </div>
  )
}

export default Home