// src/App.jsx
// Route structure — pages built in subsequent phases
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load all pages
const Home = lazy(() => import("./pages/Home"));
const Cars = lazy(() => import("./pages/Cars"));
const CarDetail = lazy(() => import("./pages/CarDetail"));
const TestDrive = lazy(() => import("./pages/TestDrive"));
const Promotions = lazy(() => import("./pages/Promotions"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Account = lazy(() => import("./pages/Account"));

// Minimal loading fallback — matches site bg
const PageLoader = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "#050A14",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "2px solid rgba(212,175,55,0.2)",
        borderTop: "2px solid #D4AF37",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/test-drive" element={<TestDrive />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
