// =====================================================================
// NOTICES SERVICE
// =====================================================================
// Ei file e Firestore "notices" collection er sathe kaj kora hoy.
// Ekhane notice ar complaint duitai post kora jay.
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

const NOTICES_COLLECTION = "notices";

// Shob notice anar jonno, notun theke purono order e
export async function fetchNoticesFromFirestore() {
  const q = query(
    collection(db, NOTICES_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Notun notice/complaint post korar jonno
// type = "notice" (admin er pokkho theke) | "complaint" (member er pokkho theke)
export async function addNoticeToFirestore({ authorId, authorName, title, message, type }) {
  const docRef = await addDoc(collection(db, NOTICES_COLLECTION), {
    authorId,
    authorName,
    title,
    message,
    type,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Notice delete korar jonno
export async function deleteNoticeFromFirestore(noticeId) {
  await deleteDoc(doc(db, NOTICES_COLLECTION, noticeId));
}
