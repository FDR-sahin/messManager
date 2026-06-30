// =====================================================================
// EXPENSES (BAZAR) SERVICE
// =====================================================================
// Ei file e Firestore "expenses" collection er sathe kaj kora hoy.
// Ekhane bazar er proti entry save hoy: ke korlo, ki kinlo, koto taka.
// =====================================================================

import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

const EXPENSES_COLLECTION = "expenses";

// Shob bazar entry anar jonno, notun theke purono order e
export async function fetchExpensesFromFirestore() {
  const q = query(
    collection(db, EXPENSES_COLLECTION),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Notun bazar entry add korar jonno
// memberName = ke bazar korlo, item = ki kinlo, amount = koto taka, date = kon din
export async function addExpenseToFirestore({ memberId, memberName, item, amount, date }) {
  const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
    memberId,
    memberName,
    item,
    amount: Number(amount),
    date, // "2026-06-21" format e
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Bazar entry delete korar jonno (vul entry hoye gele)
export async function deleteExpenseFromFirestore(expenseId) {
  await deleteDoc(doc(db, EXPENSES_COLLECTION, expenseId));
}
