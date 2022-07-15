// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFlqN9uLqB0cBRkROf8-DzMOCnvvQlJpY",
    authDomain: "spell-checker-91b46.firebaseapp.com",
    projectId: "spell-checker-91b46",
    storageBucket: "spell-checker-91b46.appspot.com",
    messagingSenderId: "22921772656",
    appId: "1:22921772656:web:f69be023f2e564f0f5beb5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);