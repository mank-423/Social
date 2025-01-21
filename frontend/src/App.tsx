import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Posts from './pages/Posts'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/posts' element={<Posts />}/>
        <Route path='/' element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
