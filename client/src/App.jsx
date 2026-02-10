import React from 'react'
import { useRoutes, NavLink, Navigate } from 'react-router-dom'
import Locations from './pages/Locations'
import LocationEvents from './pages/LocationEvents'
import Events from './pages/Events'
import './App.css'

const App = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <Locations />
    },
    {
      path: '/locations/:slug',
      element: <LocationEvents />
    },
    {
      path: '/events',
      element: <Events />
    },
    {
      path: '*',
      element: <Navigate to='/' replace />
    }
  ])

  return (
    <div className='app'>
      <header className='main-header'>
        <div className='header-titles'>
          <h1>UnityGrid Plaza</h1>
          <p>Virtual community hub for four electric sports venues</p>
        </div>

        <nav className='header-buttons'>
          <NavLink to='/' role='button'>Venues</NavLink>
          <NavLink to='/events' role='button'>All Events</NavLink>
        </nav>
      </header>

      <main>
        {element}
      </main>
    </div>
  )
}

export default App
