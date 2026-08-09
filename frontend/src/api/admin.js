import { apiRequest } from "./client.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function createInvitation({ email, role }) {
  return apiRequest("/admin/invitations", {
    method: "POST",
    body: { email, role },
  });
}

export async function uploadEligibleStudentsCsv(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/admin/eligible-students/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const raw = await response.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    const message = (data && data.message) || (typeof data === "string" ? data : "Upload failed");
    throw new Error(message);
  }
  return data;
}

export function promoteStudents({ department, fromYear, toYear }) {
  return apiRequest("/admin/users/promote", {
    method: "POST",
    body: { department, fromYear, toYear },
  });
}

export function graduateStudents({ department, academicYear }) {
  return apiRequest("/admin/users/graduate", {
    method: "POST",
    body: { department, academicYear },
  });
}

export function updateAccountStatus(userId, status) {
  return apiRequest(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: { status },
  });
}