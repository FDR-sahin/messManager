// =====================================================================
// AUTH CONTEXT
// =====================================================================
// Ei file ta shobshomoy track kore rakhe je current user login kora ache
// ki na, ar shei user "admin" naki "member". Eta App er sob jaygay
// useAuth() hook diye access kora jay.
// =====================================================================

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Firebase auth user
  const [userProfile, setUserProfile] = useState(null); // Firestore er member info (role shoho)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged: jokhoni login/logout hoy, eta automatic call hoy
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // user login thakle, Firestore theke tar profile (role, naam) niye asha hocche
        try {
          const docRef = doc(db, "members", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile({ id: docSnap.id, ...docSnap.data() });
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Profile load korte somossa hoyeche:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin = userProfile?.role === "admin";

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Eta use kore j kono component theke current user/role jana jabe
export function useAuth() {
  return useContext(AuthContext);
}
