import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavBarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

interface NavBarItem {
  name: string;
  link: string;
  action?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems: NavBarItem[] = isLoggedIn
    ? [
        { name: 'Shop', link: '/shop' },
        { name: 'Profile', link: '/profile' },
        { name: 'Inventory', link: '/inventory' },
        { name: 'Log out', link: '/login', action: handleLogout },
      ]
    : [{ name: 'Get Started', link: '/login' }];

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
              onClick={item.action}
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