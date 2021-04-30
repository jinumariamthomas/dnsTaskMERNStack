import React, { useContext } from 'react';
import { NavLink,Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
     
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/products`}>DASHBOARD</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/products/new">ADD PRODUCT</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">LOG IN</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <Link to="/products/new">
        <li>
          
          <button onClick={auth.logout}>LOGOUT</button>
          
        </li>
        </Link>
      )}
    </ul>
  );
};

export default NavLinks;
