import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaCarSide } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import "./Navbar.css";
function Navigation() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <ul className="navigation">
      <li className={currentPath === "/" ? "active" : ""}>
        <Link to="/">
          <span className="icon">
            <FaHome />
          </span>
        </Link>
      </li>
      <li className={currentPath === "/status" ? "active" : ""}>
        <Link to="/status">
          <span className="icon">
            <FaChartLine />
          </span>
        </Link>
      </li>
      <li className={currentPath === "/garage-map" ? "active" : ""}>
        <Link to="/garage-map">
          <span className="icon">
            <FaCarSide />
          </span>
        </Link>
      </li>
      <li className={currentPath === "/driver-list" ? "active" : ""}>
        <Link to="/driver-list">
          <span className="icon">
            <FaUsers />
          </span>
        </Link>
      </li>

      <div className="indicator"></div>
    </ul>
  );
}

export default Navigation;
