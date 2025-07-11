import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const role = localStorage.getItem("role")?.toUpperCase(); // "TRAINER" or "MEMBER"
  const location = useLocation();
  const isTrainer = role === "TRAINER";

  const navItems = [
    {
      label: "Dashboard",
      icon: "bi-speedometer2",
      path: isTrainer ? "/trainer" : "/member",
    },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar p-4 shadow">
        <h4 className="sidebar-title">
          {isTrainer ? "Trainer Panel" : "Member Panel"}
        </h4>

        <ul className="nav flex-column w-100">
          {navItems.map((item, idx) => (
            <li className="nav-item" key={idx}>
              <Link
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
                to={item.path}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="logout-wrapper mt-auto pt-3 w-100">
          <Link className="nav-link logout-link" to="/">
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
