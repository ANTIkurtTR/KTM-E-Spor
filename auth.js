// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBddP_ywDZOm_LH4ZoaLK-6cfy0zItzAGg",
  authDomain: "ktm-e-spor.firebaseapp.com",
  projectId: "ktm-e-spor",
  storageBucket: "ktm-e-spor.appspot.com",
  messagingSenderId: "597482404669",
  appId: "1:597482404669:web:b525c8eabbc7a4df91a354",
  measurementId: "G-RC86SG26NY"
};

// Firebase başlat
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Kayıt fonksiyonu
async function registerUser(email, password, displayName) {
  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    await userCred.user.updateProfile({ displayName });
    await db.collection('users').doc(userCred.user.uid).set({
      email,
      displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('Kayıt başarılı!');
  } catch (err) {
    alert(err.message);
  }
}

// Giriş fonksiyonu
async function loginUser(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert('Giriş başarılı!');
  } catch (err) {
    alert(err.message);
  }
}

// Şifre sıfırlama fonksiyonu
async function resetPassword(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    alert('Şifre sıfırlama linki gönderildi!');
  } catch (err) {
    alert(err.message);
  }
}

// Oturum durumu takibi
auth.onAuthStateChanged(user => {
  if (user) console.log('Giriş yapmış:', user.email);
  else console.log('Kullanıcı çıkış yaptı');
});

// Fonksiyonları export et (script.js'de kullanmak için)
export { registerUser, loginUser, resetPassword };
