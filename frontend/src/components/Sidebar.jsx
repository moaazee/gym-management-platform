import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const role = localStorage.getItem("role")?.toUpperCase(); // "TRAINER" or "MEMBER"
  const location = useLocation();

  const isTrainer = role === "TRAINER";
  const basePath = isTrainer ? "/trainer" : "/member";

  const navItems = isTrainer
    ? [
        { label: "Dashboard", path: "/trainer" },
        { label: "Programs", path: "/trainer/programs" },
        { label: "Meal Plans", path: "/trainer/meals" },
      ]
    : [{ label: "Dashboard", path: "/member" }];

  return (
    <div className="sidebar">
      <h4 className="text-center mt-3">
        {isTrainer ? "Trainer Panel" : "Member Panel"}
      </h4>
      <ul className="nav flex-column p-3">
        {navItems.map((item, idx) => (
          <li className="nav-item" key={idx}>
            <Link
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              to={item.path}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="nav-item">
          <Link className="nav-link text-danger" to="/">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
