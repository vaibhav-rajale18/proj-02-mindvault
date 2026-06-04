import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mindvault_token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-title">MindVault</div>
        <p className="navbar-subtitle">
          A focused journal for disciplined preparation.
        </p>
      </div>
      <button className="secondary" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default Navbar;
