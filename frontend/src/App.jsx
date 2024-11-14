import { useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from './components/Auth/SignupForm';
import "./index.css";
import LoggedIn from './components/LoggedIn';
import { CurrentUserProvider } from './components/UserContext';
import Task from './components/Task';
import SignupForm from './components/Auth/SignupForm';
import LoginForm from './components/Auth/LoginForm';
import Navbar from './components/Navbar';
import Board from './components/Board/Board';
import PrivateRoutes from './components/Auth/PrivateRoutes';
import GuestRoutes from './components/Auth/GuestRoutes';



function App() {

  return (
    <>
      <Router>
        <CurrentUserProvider >
          <Navbar />

          <Routes>
            <Route Component={GuestRoutes} >
              <Route path="/login" Component={LoginForm}/>
              <Route path="/signup" Component={SignupForm}/>
            </Route>
            
            <Route Component={PrivateRoutes}>
              <Route path="/board" Component={Board}/>
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </CurrentUserProvider>
      </Router>
    </>
  )
}

export default App
