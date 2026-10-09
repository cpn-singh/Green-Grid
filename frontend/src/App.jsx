import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLanding from './AppLanding';
import SynapseCursor from './components/ui/SynapseCursor';

// Lazy load secondary routes so heavy packages (like Leaflet on /map) don't block the initial landing page
const Register = lazy(() => import('./pages/Auth/Register'));
const Login = lazy(() => import('./pages/Auth/Login'));
const DCProfileForm = lazy(() => import('./pages/DCBuilder/ProfileForm'));
const DCResults = lazy(() => import('./pages/DCBuilder/Results'));
const SupplierProfileForm = lazy(() => import('./pages/Supplier/ProfileForm'));
const SupplierDashboard = lazy(() => import('./pages/Supplier/Dashboard'));
const LiveMapDashboard = lazy(() => import('./pages/Map/LiveMapDashboard'));
const SourcesIndexPage = lazy(() => import('./pages/Sources/SourcesIndexPage'));
const SourceDetailPage = lazy(() => import('./pages/Sources/SourceDetailPage'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SynapseCursor />
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
            <Route path="/solar" element={<SourceDetailPage sourceIdOverride="solar" />} />
            <Route path="/wind" element={<SourceDetailPage sourceIdOverride="wind" />} />
            <Route path="/hydro" element={<SourceDetailPage sourceIdOverride="large-hydro" />} />
            <Route path="/water" element={<SourceDetailPage sourceIdOverride="large-hydro" />} />
            <Route path="/pumped-hydro" element={<SourceDetailPage sourceIdOverride="pumped-hydro" />} />
            <Route path="/bess" element={<SourceDetailPage sourceIdOverride="bess" />} />
            <Route path="/battery" element={<SourceDetailPage sourceIdOverride="bess" />} />
            <Route path="/biomass" element={<SourceDetailPage sourceIdOverride="biomass" />} />
            <Route path="/green-hydrogen" element={<SourceDetailPage sourceIdOverride="green-hydrogen" />} />
            <Route path="/hydrogen" element={<SourceDetailPage sourceIdOverride="green-hydrogen" />} />
            <Route path="/geothermal" element={<SourceDetailPage sourceIdOverride="geothermal" />} />
            <Route path="/sources" element={<SourcesIndexPage />} />
            <Route path="/sources/:sourceId" element={<SourceDetailPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
