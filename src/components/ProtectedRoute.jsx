import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roleRequired }) {
  const savedUser = localStorage.getItem("currentUser");

  if (!savedUser) return <Navigate to="/" />;

  const user = JSON.parse(savedUser);

  // If we need an instructor and they aren't one, kick them out
  if (roleRequired === "instructor" && user.role !== "instructor") {
    return <Navigate to="/studenthome" />;
  }

  return children;
}