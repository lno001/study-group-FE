import client from "./client";

export const getMyInfo = () => {
  return client.get("/api/users/me");
};

export const updateMyInfo = (data) => {
  return client.put("/api/users/me", data);
};

export const withdraw = () => {
  return client.delete("/api/users/me");
};
