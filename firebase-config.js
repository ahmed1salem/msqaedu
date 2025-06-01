// قم باستبدال القيم بما يظهر لك من Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBcfSDvxdFmBS-mCEupGxQU1V4RwHF9Vjc",
  authDomain: "msqaedu-cc93b.firebaseapp.com",
  projectId: "msqaedu-cc93b",
  storageBucket: "msqaedu-cc93b.firebasestorage.app",
  messagingSenderId: "759791291775",
  appId: "1:759791291775:web:049907328b8ae348839e4a"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
