import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import HomeView from './pages/Home/HomeView.jsx'
import GameDetailsView from './pages/GameDetails/GameDetailsView.jsx'
import RegisterView from './pages/Register/RegisterView.jsx'
import LoginView from './pages/Login/LoginView.jsx'
import FavouritesView from './pages/Favourites/FavouritesView.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/games/:gameId" element={<GameDetailsView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/login" element={<LoginView />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/favourites" element={<FavouritesView />} />
        </Route>
        <Route path="*" element={<HomeView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;