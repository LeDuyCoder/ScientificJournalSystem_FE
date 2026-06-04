import React from 'react'
import ThemeToggle from '../../shared/components/ThemeToggle'

const AppShell = ({ children }) => {
  return (
    <div className="app-shell">
      <ThemeToggle />
      {children}
    </div>
  )
}

export default AppShell
