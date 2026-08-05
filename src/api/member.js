import client from "./client";

export const applyMember = (groupId) => {
  return client.post(`/api/groups/${groupId}/members`);
};

export const getMembers = (groupId, status) => {
  return client.get(`/api/groups/${groupId}/members`, {
    params: { status: status || undefined },
  });
};

export const decideMember = (groupId, memberId, status) => {
  return client.patch(`/api/groups/${groupId}/members/${memberId}`, { status });
};

export const leaveGroup = (groupId) => {
  return client.delete(`/api/groups/${groupId}/members/me`);
};

export const kickMember = (groupId, memberId) => {
  return client.delete(`/api/groups/${groupId}/members/${memberId}`);
};

export const getMyMemberStatus = (groupId) => {
  return client.get(`/api/groups/${groupId}/members/me`);
};
