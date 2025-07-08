// ✅ JoinRoomOnlyIdWrapper.jsx
import React from "react";
import JoinRoomOnlyId from "./JoinRoomOnlyId";
import { useLocation } from "react-router-dom";

export default function JoinRoomOnlyIdWrapper() {
  const location = useLocation();
  return <JoinRoomOnlyId location={location} />;
}
