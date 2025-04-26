import axios from 'axios';
import React from 'react';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

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
                </Routes>
            </div>
        </Router>
    );
}

export default App;
