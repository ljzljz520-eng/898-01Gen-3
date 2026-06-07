import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import Publish from "@/pages/Publish";
import ExperienceDetail from "@/pages/ExperienceDetail";
import Guides from "@/pages/Guides";
import GuideDetail from "@/pages/GuideDetail";
import CreateGuide from "@/pages/CreateGuide";
import ReviewCenter from "@/pages/ReviewCenter";
import { Navbar } from "@/components/Navbar";

function AppContent() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/review');

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/experience/:id" element={<ExperienceDetail />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/create" element={<CreateGuide />} />
        <Route path="/guides/:id" element={<GuideDetail />} />
        <Route path="/review" element={<ReviewCenter />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
