import React, { useState } from 'react';
import { auth, provider } from './firebase'; 
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword ,updateProfile} from 'firebase/auth';

function App() {
  const [email, setEmail] = useState<string>(''); // State to store the email
  const [password, setPassword] = useState<string>(''); // State to store the password
  const [user, setUser] = useState<any>(null); // State to store user info (e.g., name, photo)
  const [signupButton,setSignupButton] = useState<boolean>(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Open Google login popup
      const user = result.user; // Get logged-in user's data
      setUser(user); // Set user data in state
    } catch (error) {
      console.error("Error signing in: ", error); // Handle error
    }
  };

// Handle email sign-up
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

    alert("Sign up successful!");
    setSignupButton(false);
  } catch (error: any) {
    console.error("Error signing up: ", error.message);
    alert("Error: " + error.message);
  }
};



  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission
    try {
      const result = await signInWithEmailAndPassword(auth, email, password); // Login user with email and password
      const user = result.user;
      setUser(user); // Set user data in state
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
      
      {!user ? ( // If no user is logged in, show the login options
        <div>
          {/* Google login button */}
          <button className="btn btn-primary" onClick={handleGoogleLogin}>
            Login with Google
          </button>
         
          <div className="mt-3">
            {/* Email Sign-Up/Login Form */}
            {!signupButton ? (
              <form onSubmit={handleEmailLogin}> 
              <div>
                <label>Email: </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label>Password: </label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <button className="btn btn-primary mt-2" type="submit">
                login
              </button>
              <div className="mt-2">
              <span>Don't have an account? </span>
              <button className="btn btn-link" onClick={()=>{setSignupButton(true)}}>
                Sign Up
              </button>
            </div>
            </form>
            ):(
              <form onSubmit={handleEmailSignUp}>
              <h2>Sign Up</h2>
        
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
        
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
        
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
        
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
        
              <div>
                <label>Confirm Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
        
              
        
              <button type="submit">Sign Up</button>
            </form>
            )}
            

         
          </div>
        </div>
      ) : ( // If a user is logged in, show their info and logout button
        <div>
          <h2>Welcome, {user.displayName || user.email}</h2>
          <img src={user.photoURL} alt="Profile" width={100} /> {/* Show profile photo */}
          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
