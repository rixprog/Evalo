import React, { useState, useEffect } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { LucideGithub, Menu, X, Home, Settings, Bell, Search } from 'lucide-react';
import DocumentUploader from './components/DocumentUploader';
import ModernNavbar from './components/ModernNavbar';

function App() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [signupButton, setSignupButton] = useState<boolean>(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add useEffect to listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      setUser({ ...user, displayName: `${firstName} ${lastName}` });
      setSignupButton(false);
    } catch (error: any) {
      console.error("Error signing up: ", error.message);
      alert("Error: " + error.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // NavBar component with updated styling and additional links

  const NavBar = () => (
    <nav className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <div className="flex justify-center items-center">
              <h1 className="text-4xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-500">
                  Evalo
                </span>
              </h1>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-18 no-underline ">
            <a href="home" className="no-underline border-purple-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              <span>Home</span>
            </a>
            <a href="#" className="no-underline border-transparent text-gray-500 hover:border-purple-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">

              Explore
            </a>
            <a href="#" className="no-underline border-transparent text-gray-500 hover:border-purple-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Pricing
            </a>
            <a href="#" className="no-underline border-transparent text-gray-500 hover:border-purple-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              
              About
            </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <button type="button" className="p-2 text-gray-500 hover:text-purple-500 hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-500">
              <Bell className="h-6 w-6" />
            </button>
            <button type="button" className="p-2 text-gray-500 hover:text-purple-500 hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-500">
              <Settings className="h-6 w-6" />
            </button>
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-600">
                        {user && (user.displayName || user.email)?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
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
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="no-underline border-purple-500 text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="no-underline border-transparent text-gray-600 hover:bg-purple-50 hover:border-purple-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Explore
            </a>
            <a
              href="#"
              className="no-underline border-transparent text-gray-600 hover:bg-purple-50 hover:border-purple-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Pricing
            </a>
            <a
              href="#"
              className="no-underline border-transparent text-gray-600 hover:bg-purple-50 hover:border-purple-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              About
            </a>
          </div>
        
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-purple-200 flex items-center justify-center text-lg font-bold text-purple-600">
                      {user && (user.displayName || user.email)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.displayName || user?.email}
                </div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
  
  
  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200">
      {!user ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center">
            <div className="flex justify-center items-center bg-gray-50">
              <h1 className="text-6xl font-extrabold tracking-tight">
                <div className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-500">
                  Evalo
                </div>
              </h1>
            </div>
              
              {/* <p className="text-gray-500">Welcome back! Please sign in to continue.</p> */}
            </div>

            <div className="space-y-6">
              <button className="google-button" onClick={handleGoogleLogin}>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {!signupButton ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="auth-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      className="auth-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="auth-button">
                    Sign in
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <span className="auth-link" onClick={() => setSignupButton(true)}>
                      Sign up
                    </span>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        className="auth-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        className="auth-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="auth-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      className="auth-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      className="auth-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="auth-button">
                    Create Account
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <span className="auth-link" onClick={() => setSignupButton(false)}>
                      Sign in
                    </span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <ModernNavbar user={user} handleLogout={handleLogout} />
          
<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div className="px-4 py-6 sm:px-0">
    <div className="container mx-auto p-4">
      <DocumentUploader />
    </div>
  </div>
</main>
        </div>
      )}
    </div>
  );
}

export default App;