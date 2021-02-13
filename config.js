import * as firebase from 'firebase'
require("@firebase/firestore")
const firebaseConfig = {
    apiKey: "AIzaSyCsidbnXN_Gwo28slVbbLGgGJon_AnPkrs",
    authDomain: "willi-517c2.firebaseapp.com",
    projectId: "willi-517c2",
    storageBucket: "willi-517c2.appspot.com",
    messagingSenderId: "1024530523979",
    appId: "1:1024530523979:web:b33e4f0800dc344aba6ace"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore()