import client from "./client";

// 목록 (페이징 + 필터)
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

// 상세
export const getGroup = (groupId) => {
  return client.get(`/api/groups/${groupId}`);
};

// 생성
export const createGroup = (data) => {
  return client.post("/api/groups", data);
};

// 수정
export const updateGroup = (groupId, data) => {
  return client.put(`/api/groups/${groupId}`, data);
};

// 삭제
export const deleteGroup = (groupId) => {
  return client.delete(`/api/groups/${groupId}`);
};
