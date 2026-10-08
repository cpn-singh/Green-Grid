import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLanding from './AppLanding';

// Lazy load secondary routes so heavy packages (like Leaflet on /map) don't block the initial landing page
const Register = lazy(() => import('./pages/Auth/Register'));
const Login = lazy(() => import('./pages/Auth/Login'));
const DCProfileForm = lazy(() => import('./pages/DCBuilder/ProfileForm'));
const DCResults = lazy(() => import('./pages/DCBuilder/Results'));
const SupplierProfileForm = lazy(() => import('./pages/Supplier/ProfileForm'));
const SupplierDashboard = lazy(() => import('./pages/Supplier/Dashboard'));
const LiveMapDashboard = lazy(() => import('./pages/Map/LiveMapDashboard'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-[#080b09]" />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
