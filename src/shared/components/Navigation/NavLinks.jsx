import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-content";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  const logoutHandler = () => {
    if (auth.isLoggedIn) {
      auth.logout();
    }
  };

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact="true">
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}

      <li>
        <NavLink to="/auth" onClick={logoutHandler}>
          {auth.isLoggedIn ? "LOGOUT" : "AUTHENTICATE"}
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
