import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

interface NavBarProps {
  isLoggedIn: boolean;
}

interface NavBarItem {
  name: string;
  link: string;
}

const NavBar = (props: NavBarProps) => {
  const {isLoggedIn} = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  const navItems: NavBarItem[] = isLoggedIn
    ? [
      {name: 'Shop', link: '/shop'},
      {name: 'Profile', link: '/profile'},
      {name: 'Inventory', link: '/inventory'},
      {name: 'Log out', link: '/logout'},
    ]
    : [{name: 'Sign in/up', link: '/login'}];
  return (
    <nav className='bg-soa-purple text-white p-4'>
      <div className='container mx-auto flex items-center justify-between'>
        <div className='w-1/3'></div>
        {/* Spacer */}

        <div className='text-xl text-soa-white font-mono font-bold'>
          <Link
            to='/'
            className='order-1 transition-colors hover:text-soa-accent'
          >
            Siege of Arcana
          </Link>
        </div>

        <div className='flex text-soa-white space-x-9 w-1/3 justify-end'>
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`transition-colors hover:text-soa-accent`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
