import React from 'react'
import {Route, Routes} from 'react-router';
import '@ant-design/v5-patch-for-react-19';
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import ToDoList from './pages/ToDo/ToDoList';
import '@ant-design/icons'
import Navbar from './components/Navbar';

function App() {
  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <main style={{flex: 1}}>
        <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/to-do-list' element={<ToDoList/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
