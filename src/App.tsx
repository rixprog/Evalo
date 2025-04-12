// src/App.tsx
import React, { useState } from 'react'; // Import useState to handle the user's login state
import { auth, provider } from './firebase'; // Import Firebase auth and provider
import { signInWithPopup, signOut } from 'firebase/auth'; // Import signIn and signOut methods


function App() {
  const [email,setEmail] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const [user, setUser] = useState<any>(null);// State to store user info (e.g., name, photo)

  // Handle Google login
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Opens Google login pop-up
      const user = result.user; // Get the logged-in user's data
      setUser(user); // Set the user data in state
    } catch (error) {
      console.error("Error signing in: ", error); // Handle error
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Clear user data from state
    } catch (error) {
      console.error("Error signing out: ", error); // Handle error
    }
  };

  return (
    <div className="container">
      <h1>AI Exam Correction App</h1>
      
      {!user ? ( // If no user is logged in, show the login button
        <button className="btn btn-primary" onClick={handleLogin}>
          Login with Google
        </button>
      ) : ( // If a user is logged in, show user info and logout button
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <img src={user.photoURL} alt="Profile" width={100} /> {/* Show profile photo */}
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

