// =====================================================================
// BILLS SERVICE
// =====================================================================
// Ei file e Firestore "bills" collection er sathe kaj kora hoy.
// Ekhane bari bhara, WiFi bill, current bill etc track kora hoy —
// kar bill, koto taka, due date kobe, paid kina.
// =====================================================================

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

const BILLS_COLLECTION = "bills";

// Shob bill anar jonno, due date onujayi sajiye
export async function fetchBillsFromFirestore() {
  const q = query(collection(db, BILLS_COLLECTION), orderBy("dueDate", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Notun bill add korar jonno
// type = "bari_bhara" | "wifi" | "current" | "other"
// memberId = kar bill (bari bhara hole shob member-er jonno alada entry hote pare)
export async function addBillToFirestore({
  memberId,
  memberName,
  type,
  amount,
  month,
  dueDate,
}) {
  const docRef = await addDoc(collection(db, BILLS_COLLECTION), {
    memberId,
    memberName,
    type,
    amount: Number(amount),
    month, // "June 2026" format e
    dueDate, // "2026-06-30" format e
    isPaid: false,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Bill paid status toggle korar jonno
export async function updateBillPaidStatus(billId, isPaid) {
  await updateDoc(doc(db, BILLS_COLLECTION, billId), { isPaid });
}

// Bill delete korar jonno
export async function deleteBillFromFirestore(billId) {
  await deleteDoc(doc(db, BILLS_COLLECTION, billId));
}
