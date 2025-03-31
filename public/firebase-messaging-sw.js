importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCoysndeX1Jusmojzj746f0P1dQAU10Uh4",
  authDomain: "influencerlink-af410.firebaseapp.com",
  projectId: "influencerlink-af410",
  storageBucket: "influencerlink-af410.firebasestorage.app",
  messagingSenderId: "1059987074877",
  appId: "1:1059987074877:web:9e9fbd8d7b723d38821f54"
};

// Initialize Firebase inside the Service Worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/logo192.png", // Change to your app icon
  });
});
