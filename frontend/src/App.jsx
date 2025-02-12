import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import Register from './components/pages/Auth/Register';
import Login from './components/pages/Auth/Login';
import NavBar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';
import { UserProvider } from './context/UserContext';
import Message from './components/layout/Message';
import Profile from './components/pages/User/Profile';

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <NavBar></NavBar>
        <Message></Message>
        <Container>
          <Routes>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/register' element={<Register></Register>}></Route>
            <Route path='/user/profile' element={<Profile></Profile>}></Route>
            <Route path='/' element={<Home></Home>}></Route>
          </Routes>
        </Container>
        <Footer></Footer>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
