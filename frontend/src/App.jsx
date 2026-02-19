import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Questionnaire from "./Questionaire.jsx";
import Login from "./Login.jsx";

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();

  }, []);

  if (loading) return <h2>Loading...</h2>;

  if (!user) return <Login />;

  return (
    <div>

      <button onClick={() => signOut(auth)}>
        Logout
      </button>

      <Questionnaire />

    </div>
  );
}

export default App;