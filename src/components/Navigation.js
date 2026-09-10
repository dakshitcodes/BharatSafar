import React from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav className="navigation" aria-label="Primary Navigation">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo" aria-label="Bharatverse Home">
          <h2>Bharatverse</h2>
        </NavLink>
        <ul className="nav-menu" role="menubar">
          <li className="nav-item" role="none">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              role="menuitem"
              end
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item" role="none">
            <NavLink
              to="/heritage"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              role="menuitem"
            >
              Heritage Sites
            </NavLink>
          </li>
          <li className="nav-item" role="none">
            <NavLink
              to="/festivals"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              role="menuitem"
            >
              Festivals
            </NavLink>
          </li>
          <li className="nav-item" role="none">
            <NavLink
              to="/art-forms"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              role="menuitem"
            >
              Art Forms
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
