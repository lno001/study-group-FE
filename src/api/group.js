import client from "./client";

export const getGroups = ({ page = 0, size = 10, region, status } = {}) => {
  return client.get("/api/groups", {
    params: {
      page,
      size,
      region: region || undefined,
      status: status || undefined,
    },
  });
};

export const getMyGroups = ({ page = 0, size = 10 } = {}) => {
  return client.get("/api/groups/my", {
    params: { page, size },
  });
};

export const getGroup = (groupId) => {
  return client.get(`/api/groups/${groupId}`);
};

export const createGroup = (data) => {
  return client.post("/api/groups", data);
};

export const updateGroup = (groupId, data) => {
  return client.put(`/api/groups/${groupId}`, data);
};

export const deleteGroup = (groupId) => {
  return client.delete(`/api/groups/${groupId}`);
};
