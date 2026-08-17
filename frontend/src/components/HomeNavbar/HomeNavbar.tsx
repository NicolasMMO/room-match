import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../index';

const HomeNavbar: React.FC = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-10 w-full px-[5%] py-5">
      <div className="flex justify-between items-center">
        <Logo className="text-white" size="medium" />
        <div className="flex items-center space-x-8">
          <Link
            to="/login"
            className="inline-block px-7 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white no-underline font-semibold rounded-lg transition-all hover:bg-opacity-30"
          >
            Entrar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
