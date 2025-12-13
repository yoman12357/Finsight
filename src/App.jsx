import React, { useEffect, useState } from 'react';
import Login from './Login.jsx';
import { auth, db } from './firebase'; // Ensure this path is correct based on your folder
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  // --- NEW FUNCTION TO CALL YOUR BACKEND ---
  const callBackend = async () => {
    if (!user) return;

    // 1. Get the secure Token
    const token = await user.getIdToken();

    // 2. Send data to your local Express server
    try {
      const response = await fetch('http://localhost:5000/api/save-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send token for verification
        },
        body: JSON.stringify({
          note: "This data is coming from React!",
          timestamp: new Date()
        })
      });

      const result = await response.json();
      alert(result.message); // Should say "Success!..."
      console.log(result);
    } catch (error) {
      console.error("Backend Error:", error);
      alert("Failed to connect to backend. Is it running?");
    }
  };

  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <div style={{ color: 'white', background: '#0f0c29', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
          <h1>Welcome to FinSight, {user.displayName || userData?.username}!</h1>
          <p>Email: {user.email}</p>

          <div style={{ margin: '30px', border: '1px solid #444', padding: '20px', borderRadius: '10px' }}>
            <h3>Backend Connection Test</h3>
            <button
              onClick={callBackend}
              style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '5px' }}
            >
              Send Data to Server
            </button>
          </div>

          <button
            onClick={handleLogout}
            style={{ padding: '10px 20px', background: '#ff4b4b', color: 'white', border: 'none', cursor: 'pointer', marginTop: '20px' }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default App;