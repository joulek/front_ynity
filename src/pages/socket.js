import { io } from "socket.io-client";

const socket = io("https://ynity-backend.onrender.com", {
  withCredentials: true
});

export default socket;
