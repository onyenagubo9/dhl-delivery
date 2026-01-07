import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function createRiderAccount(
  name: string,
  email: string,
  password: string,
  phone: string,
  country: string
) {
  const userCred =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const uid = userCred.user.uid;

  await setDoc(doc(db, "users", uid), {
    role: "rider",
    name,
    email,
    phone,
    country,
    isAvailable: true,
    createdAt: serverTimestamp(),
  });

  return uid;
}
