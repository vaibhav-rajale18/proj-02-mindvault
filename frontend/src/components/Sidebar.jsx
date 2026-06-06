import { useNavigate } from "react-router-dom";
import Streak from "./Streak";

const Sidebar = ({ entries = [] }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mindvault_token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo">MindVault</div>
        <p className="logo-sub">Your thoughts, secured.</p>
      </div>

      <nav className="nav-links">
        <button className="nav-link active">Dashboard</button>
        <button className="nav-link">Journals</button>
        <button className="nav-link">Analytics</button>
        <button className="nav-link">Calendar</button>
        <button className="nav-link">Tags</button>
        <button className="nav-link">Mood Stats</button>
        <button className="nav-link">Settings</button>
      </nav>

      <div className="sidebar-footer">
        <div className="side-card">
          <p className="eyebrow">Keep going!</p>
          <Streak entries={entries} />
        </div>

        <button className="secondary logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
