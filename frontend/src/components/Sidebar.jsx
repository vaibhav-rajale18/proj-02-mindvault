import { NavLink, useNavigate } from "react-router-dom";
import Streak from "./Streak";

const navItems = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/journals", icon: "📓", label: "Journals" },
  { to: "/analytics", icon: "📊", label: "Analytics" },
  { to: "/calendar", icon: "📅", label: "Calendar" },
  { to: "/tags", icon: "🏷️", label: "Tags" },
  { to: "/mood-stats", icon: "😊", label: "Mood Stats" },
  { to: "/settings", icon: "⚙️", label: "Settings" },
];

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
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
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
