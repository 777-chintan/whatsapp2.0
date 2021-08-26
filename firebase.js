import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyALxrJrVJLYdTSVaa4vGntMzVQSvcpCBfw",
    authDomain: "whatsapp2-f6dd2.firebaseapp.com",
    projectId: "whatsapp2-f6dd2",
    storageBucket: "whatsapp2-f6dd2.appspot.com",
    messagingSenderId: "1081034612957",
    appId: "1:1081034612957:web:1d7765355419d9b677fb34"
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider}