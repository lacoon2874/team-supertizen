import {
  Container,
  Title,
  Plus,
  ClothingCare,
} from "@/pages/SmartThings/smartStyle";
import SmartBottomNavbar from "@/components/smartbottomnavbar";
import image from "@/assets/homeclothingcare.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { registerServiceWorker } from "@/registerServiceWorker";
import axios from "axios";
import { BASE_URL } from "@/config/config";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
};

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);

      // Initialize Firebase Cloud Messaging and get a reference to the service
      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey:
          "BAvKNpOFBUcGQgfMg7mJV5eEzLVomA0XLUxAKAQOue4bTD0X9m0SkhG5RBy-PiuayPH0-Du2APzhRDTjfFAl0eA",
      }).then((currenttoken) => {
        if (currenttoken) {
          console.log("current token", currenttoken);
          localStorage.setItem("FCMtoken", currenttoken);
          const userToken = localStorage.getItem("token");
          console.log("user token", userToken);
          const data = {
            token: localStorage.getItem("FCMtoken"),
          };

          try {
            axios({
              method: "post",
              url: `${BASE_URL}/notifications`,
              headers: {
                "User-ID": userToken,
              },
              data: data,
            }).then((res) => res.data);
            console.log("token post 성공");
          } catch (error) {
            console.log("token post 실패", error);
          }
        } else {
          console.log("cant get token");
        }
      });
      registerServiceWorker();

      // onMessage(messaging, (payload) => {
      //   // console.log("알림 도착 ", payload);
      //   const notificationTitle = payload.notification.title;
      //   const notificationOptions = {
      //     body: payload.notification.body,
      //   };

      //   // if (notificationTitle.length > 0 && notificationTitle != undefined) {
      //     if (Notification.permission === "granted") {
      //       new Notification(notificationTitle, notificationOptions);
      //     }
      //   // }
      // });
      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        navigator.serviceWorker.ready.then(function (registration) {
          // payload.notification에는 알림에 필요한 정보(title, body 등)가 포함되어 있어야 합니다.
          const notificationTitle = payload.notification.title;
          const notificationOptions = {
            body: payload.notification.body,
            // 여기에 추가적인 알림 옵션을 지정할 수 있습니다.
          };

          registration.showNotification(notificationTitle, notificationOptions);
        });
      });
    } else {
      console.log("permission denied");
    }
  });
}

function SmartThings() {
  const navigate = useNavigate();
  useEffect(() => {
    requestPermission();
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", "#648FBA");

    // 컴포넌트가 언마운트될 때 원래 색상으로 복원(선택적)
    return () => {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", "#ffffff");
    };
  }, []);

  return (
    <Container>
      <Title>SmartThings</Title>
      <Plus>+</Plus>
      <ClothingCare
        onClick={() => {
          navigate("/agreement");
        }}
      >
        <img src={image} alt="" />
      </ClothingCare>
      <SmartBottomNavbar />
    </Container>
  );
}

export default SmartThings;
