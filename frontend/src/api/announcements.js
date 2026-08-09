import { apiRequest } from "./client.js";

export function getAnnouncements() {
  return apiRequest("/announcements");
}

export function createAnnouncement(dto) {
  return apiRequest("/announcements", { method: "POST", body: dto });
}

export function updateAnnouncement(id, dto) {
  return apiRequest(`/announcements/${id}`, { method: "PUT", body: dto });
}

export function deleteAnnouncement(id) {
  return apiRequest(`/announcements/${id}`, { method: "DELETE" });
}