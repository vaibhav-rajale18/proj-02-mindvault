import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Journals from "./pages/Journals";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Tags from "./pages/Tags";
import MoodStats from "./pages/MoodStats";
import Settings from "./pages/Settings";
import LogDetails from "./pages/LogDetails";

function App() {
  const token = localStorage.getItem("mindvault_token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journals" element={<Journals />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/mood-stats" element={<MoodStats />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/log/:id" element={<LogDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
