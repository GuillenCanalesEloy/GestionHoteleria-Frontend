import { Navigate, useLocation } from "react-router-dom";

const SESSION_KEYS = {
  ADMIN: "luxestay.adminSession",
  CLIENTE: "luxestay.clientSession",
};

function readSession(key) {
  try {
    const storedSession = localStorage.getItem(key);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    return null;
  }
}

function getSessionForRole(role) {
  if (role === "ADMIN") {
    return readSession(SESSION_KEYS.ADMIN);
  }

  if (role === "CLIENTE") {
    return readSession(SESSION_KEYS.CLIENTE);
  }

  return readSession(SESSION_KEYS.ADMIN) || readSession(SESSION_KEYS.CLIENTE);
}

function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const session = getSessionForRole(role);
  const hasToken = Boolean(session?.token);
  const hasRole = !role || session?.rol === role;

  if (!hasToken || !hasRole) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          closeTo: "/",
          returnTo: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
