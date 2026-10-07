import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLanding from './AppLanding';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import DCProfileForm from './pages/DCBuilder/ProfileForm';
import DCResults from './pages/DCBuilder/Results';
import SupplierProfileForm from './pages/Supplier/ProfileForm';
import SupplierDashboard from './pages/Supplier/Dashboard';
import LiveMapDashboard from './pages/Map/LiveMapDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLanding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dc/profile" element={<DCProfileForm />} />
          <Route path="/dc/results" element={<DCResults />} />
          <Route path="/supplier/profile" element={<SupplierProfileForm />} />
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/map" element={<LiveMapDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
