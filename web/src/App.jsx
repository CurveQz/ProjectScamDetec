import { Routes, Route, NavLink } from "react-router-dom";
import CheckPage from "./pages/CheckPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import ServerStatus from "./components/ServerStatus.jsx";

// โครงหลักของเว็บ: แถบเมนูด้านบน + เนื้อหาแต่ละหน้า
export default function App() {
  return (
    <div className="app">
      <header className="header">
        <span className="logo">SMS Scam Detector</span>
        <nav className="nav">
          <NavLink to="/" end>ตรวจข้อความ</NavLink>
          <NavLink to="/report">ส่งข้อความเข้าระบบ</NavLink>
        </nav>
      </header>

      <ServerStatus />

      <main className="main">
        <Routes>
          <Route path="/" element={<CheckPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="*" element={<p>ไม่พบหน้านี้</p>} />
        </Routes>
      </main>
    </div>
  );
}
