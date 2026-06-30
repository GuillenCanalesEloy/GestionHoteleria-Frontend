const CLIENT_SESSION_KEY = "luxestay.clientSession";
const ADMIN_SESSION_KEY = "luxestay.adminSession";

/**
 * @returns {({ id: number, nombre: string, email: string, rol: 'CLIENTE' | 'ADMIN' } | null)}
 */
export function getCurrentUser() {
  const adminSessionString = localStorage.getItem(ADMIN_SESSION_KEY);
  const clientSessionString = localStorage.getItem(CLIENT_SESSION_KEY);

  const sessionString = adminSessionString || clientSessionString;

  if (sessionString) {
    try {
      const session = JSON.parse(sessionString);
      // The session object from the backend seems to contain a 'user' property
      return session?.user || null;
    } catch (error) {
      console.error("Failed to parse user session:", error);
      return null;
    }
  }

  return null;
}
