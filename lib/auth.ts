import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

/* ---------------- LOGIN ---------------- */
export async function loginUser(
  email: string,
  password: string
): Promise<"admin" | "rider" | "customer"> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    throw new Error("User profile not found");
  }

  const { role } = userDoc.data();
  if (!role) {
    throw new Error("User role missing");
  }

  document.cookie = `uid=${user.uid}; path=/; SameSite=Lax`;
  document.cookie = `role=${role}; path=/; SameSite=Lax`;

  return role;
}

/* ---------------- REGISTER ---------------- */
export async function registerUser(
  email: string,
  password: string
): Promise<void> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Create Firestore profile
  await setDoc(doc(db, "users", user.uid), {
    email,
    role: "customer", // default role
    createdAt: serverTimestamp(),
  });

  // Set cookies for middleware
  document.cookie = `uid=${user.uid}; path=/; SameSite=Lax`;
  document.cookie = `role=customer; path=/; SameSite=Lax`;
}
