import axios from 'axios';
import React from 'react';
import Login from './components/Login';
import Signup from './components/Signup'
import Selection from './components/Selection'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import MyCalendar from './components/MyCalendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Dashboard from './components/Dashboard';
import Edit from './components/Edit';

const apiCall = () => {
  axios.get('http://localhost:8080').then((data) => {
    //this console.log will be in our frontend console
    console.log(data)
  })
}

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path='/cal' element={<MyCalendar />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/selection" element={<Selection />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/edit" element={<Edit />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
