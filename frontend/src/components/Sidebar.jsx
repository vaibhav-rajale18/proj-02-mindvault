import { NavLink, useNavigate } from "react-router-dom";
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
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/journals"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Journals
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Analytics
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Calendar
        </NavLink>
        <NavLink
          to="/tags"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Tags
        </NavLink>
        <NavLink
          to="/mood-stats"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Mood Stats
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Settings
        </NavLink>
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
