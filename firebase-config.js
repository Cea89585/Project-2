// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgL7vA1Le7VDG4X4Wj6ZeTBoot0edwcTY",
  authDomain: "farm-idle-d769a.firebaseapp.com",
  databaseURL: "https://farm-idle-d769a-default-rtdb.firebaseio.com",
  projectId: "farm-idle-d769a",
  storageBucket: "farm-idle-d769a.firebasestorage.app",
  messagingSenderId: "689394920529",
  appId: "1:689394920529:web:347b8a7beab450b0eb5c70",
  measurementId: "G-VFNNEV7SLV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();