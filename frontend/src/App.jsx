import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ProfileEdit from './pages/ProfileEdit.jsx'
import PublicProfile from './pages/PublicProfile.jsx'
import ProfilesPage from './pages/ProfilesPage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/profile/edit/:id" element={<ProfileEdit />} />
        
        {/* Ruta pública para ver perfiles por slug */}
        <Route path="/:slug" element={<PublicProfile />} />
        
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
