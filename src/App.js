import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import VariantsPage from './pages/VariantsPage/VariantsPage';
import MainPage from './pages/MainPage/MainPage';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import EssayPage from './pages/EssayPage/EssayPage';
import EssaysPage from './pages/EssaysPage/EssaysPage';
import EssayInputPage from './pages/EssayInputPage/EssayInputPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AppealsPage from './pages/AppealsPage/AppealsPage';
import CreateVariantPage from './pages/CreateVariantPage/CreateVariantPage';
import CheckEssayPage from './pages/CheckEssayPage/CheckEssayPage';
import AppealInputPage from './pages/AppealInputPage/AppealInputPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/variants/individual" element={<CreateVariantPage />} />
        <Route path="/variants" element={<VariantsPage />} />
        <Route path="/appeals" element={<AppealsPage />} />
        <Route path="/essays" element={<EssaysPage />} />
        <Route path="/essays/:id" element={<EssayPage />} />
        <Route path="/essays/input/:id" element={<EssayInputPage />} />
        <Route path='/essays/check/:id' element={<CheckEssayPage />} />
        <Route path="/essays/appeal/:id" element={<AppealInputPage/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;