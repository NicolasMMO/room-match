import React from 'react';
import { Logo } from '../index';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-[5%] text-center">
      <Logo className="text-white mb-5" size="medium" />
      <p className="my-5">© 2025 RoomMatch. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
