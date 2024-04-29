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
          首頁
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>我的地點</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">分享地點</NavLink>
        </li>
      )}

      <li>
        <NavLink to="/auth" onClick={logoutHandler}>
          {auth.isLoggedIn ? "登出" : "登入"}
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
