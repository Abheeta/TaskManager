import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const  Navbar = () => {

  const location = useLocation(); 


  const buttonStyle = (buttonType) => {
    if (buttonType === location.pathname) {
      return "bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50";
    }
    return "text-white hover:text-blue-100 px-4 py-1";
  };

  return (
    <nav className="bg-blue-600 px-4 py-3 flex items-center justify-between">
      <button className="text-white hover:bg-blue-700 p-2 rounded-md">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </button>
      
      <div className="flex items-center">
        <Link to={"/login"}>
                <button 
                className={buttonStyle('/login')}

                >
                Login
                </button>
        </Link>


        <Link to={"/signup"}>

                <button 
                className={buttonStyle('/signup')}
                >
                Signup
                </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;