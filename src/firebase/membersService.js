// =====================================================================
// MEMBERS SERVICE
// =====================================================================
// Ei file e Firestore "members" collection er sathe shob kaj kora hoy:
// member add, list dekha, delete kora.
// Redux slice ei function gulo call kore.
// =====================================================================

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase/config";

const MEMBERS_COLLECTION = "members";

// Shob member-er list anar jonno
export async function fetchMembersFromFirestore() {
  const snapshot = await getDocs(collection(db, MEMBERS_COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Notun member add korar jonno (Admin panel theke)
// Eta first Firebase Auth e account banabe, tarpor Firestore e profile save korbe
export async function addMemberToFirestore({ name, email, password, role }) {
  // Step 1: Firebase Authentication e notun user banano hocche
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const uid = userCredential.user.uid;

  // Step 2: Firestore e member-er profile info save kora hocche
  const memberData = {
    name,
    email,
    role: role || "member", // "admin" ba "member"
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, MEMBERS_COLLECTION, uid), memberData);

  return { id: uid, ...memberData };
}

// Member-er info update korar jonno
export async function updateMemberInFirestore(memberId, updates) {
  await updateDoc(doc(db, MEMBERS_COLLECTION, memberId), updates);
}

// Member delete korar jonno (Firestore theke; Auth account alada kore delete korte hobe console theke)
export async function deleteMemberFromFirestore(memberId) {
  await deleteDoc(doc(db, MEMBERS_COLLECTION, memberId));
}
