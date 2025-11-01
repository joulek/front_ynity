import React from "react";
import { useLocation } from "react-router-dom";
import CreateRoomAuto from "./CreateRoomAuto";

export default function CreateRoomAutoWrapper() {
  const { state } = useLocation();
  return <CreateRoomAuto selectedCourseId={state?.selectedCourseId} />;
}
