import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";


const firebaseConfig = {
  apiKey: "AIzaSyBva4r34v0dTzJbFtYWlNkkO7TeMCB0BTo",
  authDomain: "codepadelgd.firebaseapp.com",
  projectId: "codepadelgd",
  storageBucket: "codepadelgd.appspot.com",
  messagingSenderId: "749732042754",
  appId: "1:749732042754:web:9f2a1de13a03f9bd582f1b"
};

const app = initializeApp(firebaseConfig);

export { app }; // Exporta la instancia de autenticación y la app
