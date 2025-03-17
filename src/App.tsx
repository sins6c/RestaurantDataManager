import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CustomerForm from './components/CustomerForm';
import Dashboard from './components/Dashboard';
import CustomerData from './components/CustomerData';
import QRCodeGenerator from './components/QRCodeGenerator';
import Analytics from './components/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerForm />} />
        <Route path="/admin" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/admin/analytics" element={
          <Layout>
            <Analytics />
          </Layout>
        } />
        <Route path="/admin/customers" element={
          <Layout>
            <CustomerData />
          </Layout>
        } />
        <Route path="/admin/qr" element={
          <Layout>
            <QRCodeGenerator />
          </Layout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App