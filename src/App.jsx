import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FinTechProvider }  from "./context/FinTechContext";
import { WalletProvider }   from "./context/WalletContext";
import { PlatformProvider } from "./context/PlatformContext";
import Navbar          from "./components/Navbar";
import Footer          from "./components/Footer";
import Dashboard       from "./pages/Dashboard";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Home            from "./pages/Home";
import About           from "./pages/About";
import Company         from "./pages/Company";
import Contact         from "./pages/Contact";
import TransferPage    from "./pages/TransferPage";
import MerchantPayPage from "./pages/MerchantPayPage";
import AdminDashboard  from "./pages/AdminDashboard";

function App() {
  return (
    <FinTechProvider>
      <WalletProvider>
        <PlatformProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public pages */}
                  <Route path="/"         element={<Home />} />
                  <Route path="/about"    element={<About />} />
                  <Route path="/company"  element={<Company />} />
                  <Route path="/contact"  element={<Contact />} />
                  <Route path="/login"    element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* User dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Send money to another StoreWallet user */}
                  <Route path="/transfer" element={<TransferPage />} />

                  {/* Merchant payment link — /pay/merchantname */}
                  <Route path="/pay/:slug" element={<MerchantPayPage />} />

                  {/* Admin panel — keep this URL private */}
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </PlatformProvider>
      </WalletProvider>
    </FinTechProvider>
  );
}

export default App;