// ------------------------
// Firebase v9 modular setup
// ------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyANaZiXCi9FgR_i7AuqaTXnqIbInI-C8hw",
  authDomain: "chat-website29.firebaseapp.com",
  projectId: "chat-website29",
  storageBucket: "chat-website29.firebasestorage.app",
  messagingSenderId: "266612606870",
  appId: "1:266612606870:web:47a3f299885cc6466f7fb7",
  measurementId: "G-P7C9J80QHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// ------------------------
// LOGIN SYSTEM
// ------------------------
let currentUser = "";
let isAdmin = false;

function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (user === "") {
    alert("Enter username");
    return;
  }

  // Admin login (password required)
  if (pass === "admin123") {
    isAdmin = true;
    currentUser = "ADMIN: " + user;
  } else {
    currentUser = user;
  }

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("chatBox").classList.remove("hidden");

  document.getElementById("roleTitle").innerText = isAdmin ? "Admin" : "User";

  loadMessages();
}

// ------------------------
// SEND MESSAGE
// ------------------------
function sendMsg() {
  let msg = document.getElementById("msgInput").value;
  if (msg === "") return;

  const chatRef = ref(db, "chat");
  push(chatRef, {
    user: currentUser,
    admin: isAdmin,
    text: msg,
    time: Date.now()
  });

  document.getElementById("msgInput").value = "";
}

// ------------------------
// LOAD MESSAGES
// ------------------------
function loadMessages() {
  const chatRef = ref(db, "chat");

  onChildAdded(chatRef, function(snapshot) {
    let data = snapshot.val();
    let box = document.getElementById("messages");

    let div = document.createElement("div");

    if (data.admin)
      div.innerHTML = `<b style="color: yellow">${data.user}</b>: ${data.text}`;
    else
      div.innerHTML = `<b>${data.user}</b>: ${data.text}`;

    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  });
}
