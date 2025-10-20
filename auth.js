// auth.js

// Firebase v9 modüler SDK importları
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Firebase config (senin verdiğin)
const firebaseConfig = {
  apiKey: "AIzaSyBddP_ywDZOm_LH4ZoaLK-6cfy0zItzAGg",
  authDomain: "ktm-e-spor.firebaseapp.com",
  projectId: "ktm-e-spor",
  storageBucket: "ktm-e-spor.firebasestorage.app",
  messagingSenderId: "597482404669",
  appId: "1:597482404669:web:b525c8eabbc7a4df91a354",
  measurementId: "G-RC86SG26NY"
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Register fonksiyonu
export async function registerUser(email, password, displayName) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName });
    await setDoc(doc(db, "users", userCred.user.uid), {
      email,
      displayName,
      createdAt: serverTimestamp()
    });
    alert('Kayıt başarılı!');
  } catch (err) {
    alert(err.message);
  }
}

// Login fonksiyonu
export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('Giriş başarılı!');
  } catch (err) {
    alert(err.message);
  }
}

// Şifre sıfırlama
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Sıfırlama linki gönderildi, posta kutunu kontrol et.');
  } catch (err) {
    alert(err.message);
  }
}

// Login durumunu takip et (opsiyonel)
onAuthStateChanged(auth, user => {
  if (user) console.log('Giriş yapmış:', user.email);
  else console.log('Kullanıcı çıkış yaptı');
});
