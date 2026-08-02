import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

import "./index.css";

// =====================================
// NOTIFICATION PERMISSION
// =====================================

if ("Notification" in window) {
  Notification.requestPermission()
    .then((permission) => {
      console.log("Notification Permission:", permission);
    });
}

// =====================================
// SERVICE WORKER
// =====================================

if ("serviceWorker" in navigator) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log("Service Worker Registered");
        })
        .catch((error) => {
          console.log("SW ERROR =", error);
        });
    }
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);