import client from "./client";

// 회원가입
export const signup = (data) => {
  return client.post("/api/auth/signup", data);
};

// 로그인
export const login = (data) => {
  return client.post("/api/auth/login", data);
};

// 로그아웃
export const logout = () => {
  return client.post("/api/auth/logout");
};

// 토큰 재발급
export const refresh = (refreshToken) => {
  return client.post("/api/auth/refresh", { refreshToken });
};
