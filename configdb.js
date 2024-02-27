import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";


const firebaseConfig = {
  apiKey: "AIzaSyCoBbNlgwZCRTLsWGB1sFHZuXD_-STJOLY",
  authDomain: "padel-adm.firebaseapp.com",
  projectId: "padel-adm",
  storageBucket: "padel-adm.appspot.com",
  messagingSenderId: "861076439441",
  appId: "1:861076439441:web:23f2bd6eb4d181b4365a30"
};

const app = initializeApp(firebaseConfig);

export { app }; // Exporta la instancia de autenticación y la app
