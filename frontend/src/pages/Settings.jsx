import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useEntries } from "../hooks/useEntries";

const Settings = () => {
  const { entries } = useEntries();
  const [username, setUsername] = useState("MindVault User");
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="dashboard-page">
      <div className="app-shell">
        <Sidebar entries={entries} />
        <div className="container dashboard-shell">
          <div className="page-content">
            <section className="page-panel">
              <p className="eyebrow">Settings</p>
              <h1>App preferences</h1>
              <p className="panel-copy">
                Update your journaling preferences and personalize how MindVault
                behaves.
              </p>
            </section>

            <section className="page-panel">
              <div className="form-group">
                <label htmlFor="username">Display name</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="theme">Theme</label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(event) => setTheme(event.target.value)}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="notifications">Email notifications</label>
                <input
                  id="notifications"
                  type="checkbox"
                  checked={notifications}
                  onChange={(event) => setNotifications(event.target.checked)}
                />
              </div>
              <button type="button">Save settings</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
