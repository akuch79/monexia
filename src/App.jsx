import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Public pages
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

// Private pages
import DashboardLayout from "./components/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/Dashboard.jsx"; // ✅ FIXED: was missing
import AddTransaction from "./pages/AddTransaction.jsx";
import Transactions from "./pages/Transactions.jsx";
import Analytics from "./pages/Analytics.jsx";
import Education from "./pages/Education.jsx";
import BusinessTools from "./pages/BusinessTools.jsx";
import Settings from "./pages/Settings.jsx";
import Investment from "./pages/Investment.jsx";

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
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/education" element={<Education />} />
        <Route path="/business-tools" element={<BusinessTools />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/investment" element={<Investment />} /> {/* ✅ FIXED: was /investments */}
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;