import React, { useState, useEffect } from 'react';
import { Bell, Menu, Settings, X, Search, User } from 'lucide-react';

interface ModernNavbarProps {
  user: any;
  handleLogout: () => void;
}

const ModernNavbar: React.FC<ModernNavbarProps> = ({ user, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative">
                <h1 className="text-3xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500">
                    Evalo
                  </span>
                </h1>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {['home', 'explore', 'pricing', 'about'].map((item) => (
              <a 
                key={item}
                href={item === 'home' ? '/home' : `#${item}`}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeLink === item 
                    ? 'text-purple-600' 
                    : 'text-gray-600 hover:text-purple-500'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink(item);
                }}
              >
                <span className="capitalize">{item}</span>
                {activeLink === item && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full"></span>
                )}
              </a>
            ))}
          </div>
          
          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-48 pl-10 pr-4 py-1.5 bg-gray-100 border-0 rounded-full text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
              />
            </div>
            
            {/* Notification */}
            <div className="relative">
              <button className="bg-transparent p-1.5 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition duration-200">
                <Bell className="h-5 w-5" />
              </button>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-purple-500 ring-2 ring-white"></span>
            </div>
            
            {/* Settings */}
            <button className="bg-transparent p-1.5 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition duration-200">
              <Settings className="h-6 w-6" />
            </button>
            
            {/* Profile */}
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-white">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                      {user && (user.displayName || user.email)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="relative inline-flex items-center px-4 py-1.5 rounded-full overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 group-hover:from-purple-700 group-hover:to-indigo-700 transition duration-300"></span>
                <span className="relative flex items-center justify-center text-xs font-semibold text-white">
                  Sign Out
                </span>
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-100 focus:outline-none transition duration-200"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className={`px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm shadow-lg rounded-b-xl mx-2 ${isMenuOpen ? 'border-t border-gray-100' : ''}`}>
          {['home', 'explore', 'pricing', 'about'].map((item) => (
            <a
              key={item}
              href={item === 'home' ? '/home' : `#${item}`}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                activeLink === item
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
              } transition duration-200`}
              onClick={(e) => {
                e.preventDefault();
                setActiveLink(item);
                setIsMenuOpen(false);
              }}
            >
              <span className="capitalize">{item}</span>
            </a>
          ))}
          
          <div className="pt-4 pb-2">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-purple-200">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold text-white">
                      {user && (user.displayName || user.email)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 truncate max-w-[150px]">
                  {user?.displayName || 'User'}
                </div>
                <div className="text-sm font-medium text-gray-500 truncate max-w-[150px]">{user?.email}</div>
              </div>
            </div>
            
            <div className="mt-3 space-y-1">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-purple-600 hover:bg-gray-100 rounded-lg"
              >
                <Search className="mr-3 h-5 w-5" />
                Search
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-purple-600 hover:bg-gray-100 rounded-lg"
              >
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-purple-600 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full mt-2 px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition duration-200"
              >
                <User className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;