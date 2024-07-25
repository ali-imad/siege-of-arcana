import React from 'react';
import {Link, useNavigate} from "react-router-dom";

interface NavBarProps {
  isLoggedIn: boolean;
}

const NavBar = (props: NavBarProps) => {
  const { isLoggedIn } = props;
  const navigate = useNavigate()
  return (
    <nav className="bg-soa-purple text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-1/4"></div>
        <div className="text-xl text-soa-white font-mono font-bold">Siege of Arcana</div>
        <div className="flex text-soa-white space-x-9 w-1/4 justify-end">
          <Link to='/' className="order-1 transition-colors hover:text-soa-accent">Home</Link>
          <Link to='/shop' className="order-2 transition-colors hover:text-soa-accent">Shop</Link>
          <Link to='/login' className="order-3 transition-colors hover:text-soa-accent">{isLoggedIn ? 'Log Out' : 'Register/Log In'}</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
