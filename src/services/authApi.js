import hotelApi from "./hotelApi";

export const authApi = {
  /**
   * @param {{ email, password }} credentials
   * @returns {Promise<any>}
   */
  login: (credentials) => hotelApi.post("/auth/login", credentials),

  register: (data) => hotelApi.post("/auth/register", data),
};