import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h4 className="text-center mt-3">Trainer Panel</h4>
      <ul className="nav flex-column p-3">
        <li className="nav-item">
          <Link className="nav-link" to="/trainer">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/trainer/programs">Programs</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/trainer/meals">Meal Plans</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
