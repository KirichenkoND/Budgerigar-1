import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css'

import Header from './components/Header/Header';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchedulePage from './Pages/SchedulePage';
import PatientListPage from './Pages/PatientListPage';
import PatientCard from './components/PatientList/PatientCard';

import NotFound from './components/NotFound/NotFound';
import DoctorListPage from './Pages/DoctorListPage';

function App() {
  return (
    <>
      <Router>
        <div className='app'>
          <Header />
          <div className='app-info'>
            <Routes>
              <Route path='/schedule' element={<SchedulePage />} />
              <Route path='/patients' element={<PatientListPage />} />
              <Route path="/doctors" element={<DoctorListPage />} />


              <Route path='*' element={<NotFound message="404 Not Found"/>} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
