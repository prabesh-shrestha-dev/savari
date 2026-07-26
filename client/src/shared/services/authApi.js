import api from "./api";

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const register = (data) => {
  return api.post("/auth/register", data);
}

export const verifyOTP = (data) => {
  return api.post("/auth/verify-otp", data);
}

export const resendOTP = (data) => {
  return api.post("/auth/resend-otp", data);
}

export const refresh = (data) => {
  return api.post("/auth/refresh", data);
}

export const logout = () => {
  return api.get("/auth/logout");
}