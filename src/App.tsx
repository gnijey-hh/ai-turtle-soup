import { Navigate, Route, Routes } from 'react-router-dom'
import { Game } from './pages/Game'
import { Home } from './pages/Home'
import { Result } from './pages/Result'

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Game />} path="/game/:id" />
      <Route element={<Result />} path="/result/:id" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}

export default App
