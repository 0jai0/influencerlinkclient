// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoysndeX1Jusmojzj746f0P1dQAU10Uh4",
  authDomain: "influencerlink-af410.firebaseapp.com",
  projectId: "influencerlink-af410",
  storageBucket: "influencerlink-af410.firebasestorage.app",
  messagingSenderId: "1059987074877",
  appId: "1:1059987074877:web:9e9fbd8d7b723d38821f54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

// Request permission to send notifications

export const requestNotificationPermission = async (userId) => {
  try {
    if (Notification.permission === "granted") {
      console.log("Notification permission already granted.");
      return;
    }
    //console.log(userId,"no");

    if (Notification.permission === "denied") {
      console.warn("Notification permission was denied.");
      alert("You have blocked notifications. Please enable them in browser settings .");
      
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BJCPTIsZ5XvBQAATJbYgoq4wxWKDJ95pT2LClKXqe2YkEYoMiqqpPJXIoshfbXWGKzrIufYJO8uoGOD-xVgH7Po",
      });

      //console.log("FCM Token:", token);

      // Send token to backend
      await fetch(`${process.env.REACT_APP_SERVER_API}/api/notifications/store-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, token }),
      });

      return token;
    } else {
      console.log("User denied notification permission.");
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
  }
};


// Listen for messages when app is in foreground
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
});

export { messaging };