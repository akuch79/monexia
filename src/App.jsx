import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Public pages
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Private pages
import DashboardLayout from "./components/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import AddTransaction from "./pages/AddTransaction.jsx";
import Transactions from "./pages/Transactions.jsx";
import Analytics from "./pages/Analytics.jsx";
import Education from "./pages/Education.jsx";
import BusinessTools from "./pages/BusinessTools.jsx";
import Settings from "./pages/Settings.jsx";
import Investment from "./pages/Investment.jsx";
import WalletHub from "./pages/WalletHub.jsx";
import MpesaConsole from "./pages/MpesaConsole.jsx"; // ✅ M-Pesa console

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

function PrivateLayout() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Password routes — no Navbar, no auth required */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/reset-password/pending" element={<ResetPassword />} />

      {/* Private routes */}
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard"       element={<DashboardPage />} />
        <Route path="/transactions"    element={<Transactions />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/analytics"       element={<Analytics />} />
        <Route path="/education"       element={<Education />} />
        <Route path="/business-tools"  element={<BusinessTools />} />
        <Route path="/settings"        element={<Settings />} />
        <Route path="/investment"      element={<Investment />} />
        <Route path="/wallet"          element={<WalletHub />} />
        <Route path="/mpesa"           element={<MpesaConsole />} /> {/* ✅ Added */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;