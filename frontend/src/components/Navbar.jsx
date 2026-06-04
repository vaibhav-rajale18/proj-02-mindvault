import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mindvault_token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-title">MindVault</div>
      <button className="secondary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
