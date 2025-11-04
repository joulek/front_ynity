// socket.js
import { io } from "socket.io-client";
const socket = io("https://backend-ynity-1.onrender.com", { withCredentials: true });
export default socket;
