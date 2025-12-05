import React, { useEffect, useState } from 'react';
import Login from './Login.jsx';
import { auth, db } from './firebase';
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

  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <div style={{ color: 'white', background: '#0f0c29', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1>Welcome to FinSight, {user.displayName || userData?.username}!</h1>
          <p>Email: {user.email}</p>
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